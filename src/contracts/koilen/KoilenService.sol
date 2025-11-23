// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title KoilenService
 * @notice IoT sensor event logging system integrated with EVVM
 * @dev Manages hierarchical identities: Client → Branch → Sensor
 *
 * Identity Hierarchy:
 * - Client: Top-level entity (e.g., "RestaurantChain")
 * - Branch: Location under a client (e.g., "RestaurantChain_BuenosAires")
 * - Sensor: Physical device (e.g., "RestaurantChain_BuenosAires_Fridge1")
 *
 * All identities are registered in EVVM NameService with metadata:
 * - type:>client | branch | sensor
 * - parent:>parentUsername
 * - location:>address
 * - device:>model/serial
 */

import {Evvm} from "@evvm/testnet-contracts/contracts/evvm/Evvm.sol";

interface INameService {
    function getOwnerOfIdentity(string memory _username) external view returns (address);
    function verifyIfIdentityExists(string memory _identity) external view returns (bool);
    function getFullCustomMetadataOfIdentity(string memory _username) external view returns (string[] memory);
}

contract KoilenService {

    //█ State Variables ████████████████████████████████████████████████

    Evvm public immutable evvm;
    INameService public immutable nameService;

    address public admin;
    address public koilenBackend; // Backend autorizado para loguear eventos

    /// @dev Principal Token address in EVVM ecosystem
    address private constant PRINCIPAL_TOKEN = 0x0000000000000000000000000000000000000001;

    //█ Data Structures ████████████████████████████████████████████████

    /// @notice Event types for sensor readings
    enum EventType {
        NORMAL,           // 0: Lectura normal
        TEMP_HIGH,        // 1: Temperatura alta
        TEMP_LOW,         // 2: Temperatura baja
        HUMIDITY_HIGH,    // 3: Humedad alta
        HUMIDITY_LOW,     // 4: Humedad baja
        DOOR_OPEN,        // 5: Puerta abierta
        POWER_FAILURE,    // 6: Falla de energía
        SENSOR_ERROR      // 7: Error del sensor
    }

    /// @notice Sensor event data structure
    struct SensorEvent {
        bytes32 sensorId;      // Hash del username del sensor
        int256 value;          // Valor de la lectura (temp/humidity)
        uint64 timestamp;      // Unix timestamp del evento
        EventType eventType;   // Tipo de evento
        bytes32 batchHash;     // Hash del batch de lecturas
        address logger;        // Quien registró el evento
    }

    /// @notice Client credit balance for service usage
    struct ClientCredits {
        uint256 balance;       // KOIL tokens disponibles
        uint256 consumed;      // Total consumido
        uint256 lastTopUp;     // Timestamp del último top-up
        bool isActive;         // Cliente activo
    }

    //█ Storage Mappings ███████████████████████████████████████████████

    /// @dev sensorUsername => array of events
    mapping(string => SensorEvent[]) public eventsBySensor;

    /// @dev clientUsername => credits info
    mapping(string => ClientCredits) public clientCredits;

    /// @dev sensorUsername => clientUsername
    mapping(string => string) public sensorToClient;

    /// @dev clientUsername => array of sensor usernames
    mapping(string => string[]) public clientSensors;

    /// @dev Pricing: cost in KOIL tokens per event type
    mapping(EventType => uint256) public eventCosts;

    //█ Events █████████████████████████████████████████████████████████

    event SensorEventLogged(
        string indexed sensorUsername,
        bytes32 indexed sensorId,
        int256 value,
        uint64 timestamp,
        EventType eventType,
        bytes32 batchHash,
        address logger
    );

    event ClientRegistered(
        string indexed clientUsername,
        address indexed owner,
        uint256 initialCredits
    );

    event BranchRegistered(
        string indexed branchUsername,
        string indexed clientUsername,
        address indexed owner
    );

    event SensorRegistered(
        string indexed sensorUsername,
        string indexed branchUsername,
        string indexed clientUsername
    );

    event CreditsAdded(
        string indexed clientUsername,
        uint256 amount,
        uint256 newBalance
    );

    event CreditsConsumed(
        string indexed clientUsername,
        uint256 amount,
        uint256 remainingBalance
    );

    //█ Modifiers ██████████████████████████████████████████████████████

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier onlyBackend() {
        require(msg.sender == koilenBackend, "Not authorized backend");
        _;
    }

    modifier identityExists(string memory username) {
        require(nameService.verifyIfIdentityExists(username), "Identity does not exist");
        _;
    }

    //█ Constructor ████████████████████████████████████████████████████

    constructor(
        address _evvm,
        address _nameService,
        address _admin,
        address _backend
    ) {
        evvm = Evvm(_evvm);
        nameService = INameService(_nameService);
        admin = _admin;
        koilenBackend = _backend;

        // Configurar costos por defecto (en wei de KOIL tokens)
        eventCosts[EventType.NORMAL] = 0;              // Gratis
        eventCosts[EventType.TEMP_HIGH] = 1 ether;     // 1 KOIL
        eventCosts[EventType.TEMP_LOW] = 1 ether;
        eventCosts[EventType.HUMIDITY_HIGH] = 1 ether;
        eventCosts[EventType.HUMIDITY_LOW] = 1 ether;
        eventCosts[EventType.DOOR_OPEN] = 2 ether;     // 2 KOIL
        eventCosts[EventType.POWER_FAILURE] = 5 ether; // 5 KOIL
        eventCosts[EventType.SENSOR_ERROR] = 1 ether;
    }

    //█ Main Functions █████████████████████████████████████████████████

    /**
     * @notice Register a new client in the system
     * @dev Client must already be registered in NameService
     * @param clientUsername Username of the client in NameService
     * @param initialCredits Initial KOIL credits to assign
     */
    function registerClient(
        string memory clientUsername,
        uint256 initialCredits
    )
        external
        onlyAdmin
        identityExists(clientUsername)
    {
        require(!clientCredits[clientUsername].isActive, "Client already registered");

        clientCredits[clientUsername] = ClientCredits({
            balance: initialCredits,
            consumed: 0,
            lastTopUp: block.timestamp,
            isActive: true
        });

        address owner = nameService.getOwnerOfIdentity(clientUsername);

        emit ClientRegistered(clientUsername, owner, initialCredits);
    }

    /**
     * @notice Register a branch under a client
     * @dev Branch must already be registered in NameService with proper metadata
     * @param branchUsername Username of the branch in NameService
     * @param clientUsername Parent client username
     */
    function registerBranch(
        string memory branchUsername,
        string memory clientUsername
    )
        external
        onlyAdmin
        identityExists(branchUsername)
        identityExists(clientUsername)
    {
        require(clientCredits[clientUsername].isActive, "Client not registered");

        address owner = nameService.getOwnerOfIdentity(branchUsername);

        emit BranchRegistered(branchUsername, clientUsername, owner);
    }

    /**
     * @notice Register a sensor under a branch/client
     * @dev Sensor must already be registered in NameService
     * @param sensorUsername Username of the sensor in NameService
     * @param branchUsername Parent branch username
     * @param clientUsername Top-level client username
     */
    function registerSensor(
        string memory sensorUsername,
        string memory branchUsername,
        string memory clientUsername
    )
        external
        onlyAdmin
        identityExists(sensorUsername)
        identityExists(branchUsername)
        identityExists(clientUsername)
    {
        require(clientCredits[clientUsername].isActive, "Client not registered");
        require(bytes(sensorToClient[sensorUsername]).length == 0, "Sensor already registered");

        sensorToClient[sensorUsername] = clientUsername;
        clientSensors[clientUsername].push(sensorUsername);

        emit SensorRegistered(sensorUsername, branchUsername, clientUsername);
    }

    /**
     * @notice Log a sensor event (called by authorized backend)
     * @param sensorUsername Username of the sensor
     * @param value Sensor reading value
     * @param timestamp Unix timestamp of the event
     * @param eventType Type of event
     * @param batchHash Hash of the batch of readings
     */
    function logSensorEvent(
        string memory sensorUsername,
        int256 value,
        uint64 timestamp,
        EventType eventType,
        bytes32 batchHash
    )
        external
        onlyBackend
        identityExists(sensorUsername)
    {
        string memory clientUsername = sensorToClient[sensorUsername];
        require(bytes(clientUsername).length > 0, "Sensor not registered");
        require(clientCredits[clientUsername].isActive, "Client not active");

        // Consume credits if event has a cost
        uint256 cost = eventCosts[eventType];
        if (cost > 0) {
            require(clientCredits[clientUsername].balance >= cost, "Insufficient credits");
            clientCredits[clientUsername].balance -= cost;
            clientCredits[clientUsername].consumed += cost;

            emit CreditsConsumed(clientUsername, cost, clientCredits[clientUsername].balance);
        }

        // Store event
        bytes32 sensorId = keccak256(abi.encodePacked(sensorUsername));

        eventsBySensor[sensorUsername].push(
            SensorEvent({
                sensorId: sensorId,
                value: value,
                timestamp: timestamp,
                eventType: eventType,
                batchHash: batchHash,
                logger: msg.sender
            })
        );

        emit SensorEventLogged(
            sensorUsername,
            sensorId,
            value,
            timestamp,
            eventType,
            batchHash,
            msg.sender
        );
    }

    /**
     * @notice Add credits to a client's balance
     * @param clientUsername Client to top up
     * @param amount Amount of KOIL tokens to add
     */
    function topUpCredits(
        string memory clientUsername,
        uint256 amount
    )
        external
        onlyAdmin
        identityExists(clientUsername)
    {
        require(clientCredits[clientUsername].isActive, "Client not registered");
        require(amount > 0, "Amount must be positive");

        clientCredits[clientUsername].balance += amount;
        clientCredits[clientUsername].lastTopUp = block.timestamp;

        emit CreditsAdded(clientUsername, amount, clientCredits[clientUsername].balance);
    }

    //█ View Functions █████████████████████████████████████████████████

    /**
     * @notice Get all events for a sensor
     * @param sensorUsername Sensor username
     * @return Array of sensor events
     */
    function getSensorEvents(string memory sensorUsername)
        external
        view
        returns (SensorEvent[] memory)
    {
        return eventsBySensor[sensorUsername];
    }

    /**
     * @notice Get event count for a sensor
     * @param sensorUsername Sensor username
     * @return Number of events
     */
    function getSensorEventCount(string memory sensorUsername)
        external
        view
        returns (uint256)
    {
        return eventsBySensor[sensorUsername].length;
    }

    /**
     * @notice Get client credits info
     * @param clientUsername Client username
     * @return Credits structure
     */
    function getClientCredits(string memory clientUsername)
        external
        view
        returns (ClientCredits memory)
    {
        return clientCredits[clientUsername];
    }

    /**
     * @notice Get all sensors for a client
     * @param clientUsername Client username
     * @return Array of sensor usernames
     */
    function getClientSensors(string memory clientUsername)
        external
        view
        returns (string[] memory)
    {
        return clientSensors[clientUsername];
    }

    /**
     * @notice Get client for a sensor
     * @param sensorUsername Sensor username
     * @return Client username
     */
    function getSensorClient(string memory sensorUsername)
        external
        view
        returns (string memory)
    {
        return sensorToClient[sensorUsername];
    }

    //█ Admin Functions ████████████████████████████████████████████████

    function setBackendAddress(address _backend) external onlyAdmin {
        koilenBackend = _backend;
    }

    function setEventCost(EventType eventType, uint256 cost) external onlyAdmin {
        eventCosts[eventType] = cost;
    }

    function deactivateClient(string memory clientUsername) external onlyAdmin {
        clientCredits[clientUsername].isActive = false;
    }

    function activateClient(string memory clientUsername) external onlyAdmin {
        clientCredits[clientUsername].isActive = true;
    }
}
