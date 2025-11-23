// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title KoilenServiceTestPublic
 * @notice Version PÚBLICA para testing - cualquier wallet puede registrar eventos
 * @dev Solo para pruebas/demos - NO USAR EN PRODUCCIÓN
 *
 * Características:
 * - Cualquier wallet puede registrar clientes, branches y sensores
 * - Cualquier wallet puede registrar eventos en cualquier sensor
 * - Los créditos KOIL se descuentan pero no se valida ownership
 * - Perfecto para demos donde múltiples usuarios prueban el mismo sensor
 */

import {Evvm} from "@evvm/testnet-contracts/contracts/evvm/Evvm.sol";

contract KoilenServiceTestPublic {

    Evvm public immutable evvm;

    address public admin;

    address private constant PRINCIPAL_TOKEN = 0x0000000000000000000000000000000000000001;

    enum EventType {
        NORMAL,
        TEMP_HIGH,
        TEMP_LOW,
        HUMIDITY_HIGH,
        HUMIDITY_LOW,
        DOOR_OPEN,
        POWER_FAILURE,
        SENSOR_ERROR
    }

    struct SensorEvent {
        bytes32 sensorId;
        int256 value;
        uint64 timestamp;
        EventType eventType;
        bytes32 batchHash;
        address logger;
    }

    struct ClientCredits {
        uint256 balance;
        uint256 consumed;
        uint256 lastTopUp;
        bool isActive;
        address creator; // Quien creó el cliente
    }

    mapping(string => SensorEvent[]) public eventsBySensor;
    mapping(string => ClientCredits) public clientCredits;
    mapping(string => string) public sensorToClient;
    mapping(string => string[]) public clientSensors;
    mapping(EventType => uint256) public eventCosts;

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
        address indexed creator,
        uint256 initialCredits
    );

    event BranchRegistered(
        string indexed branchUsername,
        string indexed clientUsername,
        address indexed creator
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

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor(
        address _evvm,
        address _admin
    ) {
        evvm = Evvm(_evvm);
        admin = _admin;

        eventCosts[EventType.NORMAL] = 0;
        eventCosts[EventType.TEMP_HIGH] = 1 ether;
        eventCosts[EventType.TEMP_LOW] = 1 ether;
        eventCosts[EventType.HUMIDITY_HIGH] = 1 ether;
        eventCosts[EventType.HUMIDITY_LOW] = 1 ether;
        eventCosts[EventType.DOOR_OPEN] = 2 ether;
        eventCosts[EventType.POWER_FAILURE] = 5 ether;
        eventCosts[EventType.SENSOR_ERROR] = 1 ether;
    }

    /**
     * @notice Register client - CUALQUIER WALLET PUEDE HACERLO
     * @dev Permite a cualquier usuario crear un cliente con créditos
     */
    function registerClient(
        string memory clientUsername,
        uint256 initialCredits
    ) external {
        require(!clientCredits[clientUsername].isActive, "Client already registered");

        clientCredits[clientUsername] = ClientCredits({
            balance: initialCredits,
            consumed: 0,
            lastTopUp: block.timestamp,
            isActive: true,
            creator: msg.sender
        });

        emit ClientRegistered(clientUsername, msg.sender, initialCredits);
    }

    /**
     * @notice Register branch - CUALQUIER WALLET PUEDE HACERLO
     */
    function registerBranch(
        string memory branchUsername,
        string memory clientUsername
    ) external {
        require(clientCredits[clientUsername].isActive, "Client not registered");

        emit BranchRegistered(branchUsername, clientUsername, msg.sender);
    }

    /**
     * @notice Register sensor - CUALQUIER WALLET PUEDE HACERLO
     */
    function registerSensor(
        string memory sensorUsername,
        string memory branchUsername,
        string memory clientUsername
    ) external {
        require(clientCredits[clientUsername].isActive, "Client not registered");
        require(bytes(sensorToClient[sensorUsername]).length == 0, "Sensor already registered");

        sensorToClient[sensorUsername] = clientUsername;
        clientSensors[clientUsername].push(sensorUsername);

        emit SensorRegistered(sensorUsername, branchUsername, clientUsername);
    }

    /**
     * @notice Log sensor event - CUALQUIER WALLET PUEDE HACERLO
     * @dev Permite a cualquier dirección registrar eventos en cualquier sensor
     * Los créditos se descuentan del balance del cliente asociado al sensor
     */
    function logSensorEvent(
        string memory sensorUsername,
        int256 value,
        uint64 timestamp,
        EventType eventType,
        bytes32 batchHash
    ) external {
        string memory clientUsername = sensorToClient[sensorUsername];
        require(bytes(clientUsername).length > 0, "Sensor not registered");
        require(clientCredits[clientUsername].isActive, "Client not active");

        uint256 cost = eventCosts[eventType];
        if (cost > 0) {
            require(clientCredits[clientUsername].balance >= cost, "Insufficient credits");
            clientCredits[clientUsername].balance -= cost;
            clientCredits[clientUsername].consumed += cost;

            emit CreditsConsumed(clientUsername, cost, clientCredits[clientUsername].balance);
        }

        bytes32 sensorId = keccak256(abi.encodePacked(sensorUsername));

        eventsBySensor[sensorUsername].push(
            SensorEvent({
                sensorId: sensorId,
                value: value,
                timestamp: timestamp,
                eventType: eventType,
                batchHash: batchHash,
                logger: msg.sender // Registramos quién hizo el log
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
     * @notice Add credits to client
     * @dev Solo el admin puede agregar créditos
     */
    function addCredits(
        string memory clientUsername,
        uint256 amount
    ) external onlyAdmin {
        require(clientCredits[clientUsername].isActive, "Client not registered");

        clientCredits[clientUsername].balance += amount;
        clientCredits[clientUsername].lastTopUp = block.timestamp;

        emit CreditsAdded(
            clientUsername,
            amount,
            clientCredits[clientUsername].balance
        );
    }

    /**
     * @notice Get client info
     */
    function getClient(string memory clientUsername)
        external
        view
        returns (
            bool isActive,
            uint256 balance,
            uint256 consumed,
            address creator
        )
    {
        ClientCredits memory client = clientCredits[clientUsername];
        return (
            client.isActive,
            client.balance,
            client.consumed,
            client.creator
        );
    }

    /**
     * @notice Get sensor events
     */
    function getSensorEvents(string memory sensorUsername)
        external
        view
        returns (SensorEvent[] memory)
    {
        return eventsBySensor[sensorUsername];
    }

    /**
     * @notice Get sensor's client
     */
    function getSensorClient(string memory sensorUsername)
        external
        view
        returns (string memory)
    {
        return sensorToClient[sensorUsername];
    }

    /**
     * @notice Get event cost
     */
    function getEventCost(EventType eventType)
        external
        view
        returns (uint256)
    {
        return eventCosts[eventType];
    }

    /**
     * @notice Get all client sensors
     */
    function getClientSensors(string memory clientUsername)
        external
        view
        returns (string[] memory)
    {
        return clientSensors[clientUsername];
    }

    /**
     * @notice Update admin
     */
    function updateAdmin(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }

    /**
     * @notice Update event cost
     */
    function updateEventCost(EventType eventType, uint256 newCost) external onlyAdmin {
        eventCosts[eventType] = newCost;
    }
}
