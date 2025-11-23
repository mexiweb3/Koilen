// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title KoilenServiceTest
 * @notice Version simplificada para testing - sin validación de NameService
 * @dev Solo para pruebas - NO USAR EN PRODUCCIÓN
 */

import {Evvm} from "@evvm/testnet-contracts/contracts/evvm/Evvm.sol";

contract KoilenServiceTest {

    Evvm public immutable evvm;

    address public admin;
    address public koilenBackend;

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

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier onlyBackend() {
        require(msg.sender == koilenBackend, "Not authorized backend");
        _;
    }

    constructor(
        address _evvm,
        address _admin,
        address _backend
    ) {
        evvm = Evvm(_evvm);
        admin = _admin;
        koilenBackend = _backend;

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
     * @notice Register client - SIMPLIFIED (no NameService validation)
     */
    function registerClient(
        string memory clientUsername,
        uint256 initialCredits
    ) external onlyAdmin {
        require(!clientCredits[clientUsername].isActive, "Client already registered");

        clientCredits[clientUsername] = ClientCredits({
            balance: initialCredits,
            consumed: 0,
            lastTopUp: block.timestamp,
            isActive: true
        });

        emit ClientRegistered(clientUsername, msg.sender, initialCredits);
    }

    /**
     * @notice Register branch - SIMPLIFIED
     */
    function registerBranch(
        string memory branchUsername,
        string memory clientUsername
    ) external onlyAdmin {
        require(clientCredits[clientUsername].isActive, "Client not registered");

        emit BranchRegistered(branchUsername, clientUsername, msg.sender);
    }

    /**
     * @notice Register sensor - SIMPLIFIED
     */
    function registerSensor(
        string memory sensorUsername,
        string memory branchUsername,
        string memory clientUsername
    ) external onlyAdmin {
        require(clientCredits[clientUsername].isActive, "Client not registered");
        require(bytes(sensorToClient[sensorUsername]).length == 0, "Sensor already registered");

        sensorToClient[sensorUsername] = clientUsername;
        clientSensors[clientUsername].push(sensorUsername);

        emit SensorRegistered(sensorUsername, branchUsername, clientUsername);
    }

    /**
     * @notice Log sensor event
     */
    function logSensorEvent(
        string memory sensorUsername,
        int256 value,
        uint64 timestamp,
        EventType eventType,
        bytes32 batchHash
    ) external onlyBackend {
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
     * @notice Add credits
     */
    function topUpCredits(
        string memory clientUsername,
        uint256 amount
    ) external onlyAdmin {
        require(clientCredits[clientUsername].isActive, "Client not registered");
        require(amount > 0, "Amount must be positive");

        clientCredits[clientUsername].balance += amount;
        clientCredits[clientUsername].lastTopUp = block.timestamp;

        emit CreditsAdded(clientUsername, amount, clientCredits[clientUsername].balance);
    }

    // View functions
    function getSensorEvents(string memory sensorUsername)
        external
        view
        returns (SensorEvent[] memory)
    {
        return eventsBySensor[sensorUsername];
    }

    function getSensorEventCount(string memory sensorUsername)
        external
        view
        returns (uint256)
    {
        return eventsBySensor[sensorUsername].length;
    }

    function getClientCredits(string memory clientUsername)
        external
        view
        returns (ClientCredits memory)
    {
        return clientCredits[clientUsername];
    }

    function getClientSensors(string memory clientUsername)
        external
        view
        returns (string[] memory)
    {
        return clientSensors[clientUsername];
    }

    function getSensorClient(string memory sensorUsername)
        external
        view
        returns (string memory)
    {
        return sensorToClient[sensorUsername];
    }

    // Admin functions
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
