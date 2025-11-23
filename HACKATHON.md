# Koilen - IoT Monitoring on MATE Metaprotocol

## Hackathon Submission

**Project**: Koilen - Immutable IoT Sensor Monitoring Platform
**EVVM Integration**: MATE Metaprotocol (EVVM ID 2)
**Network**: Ethereum Sepolia Testnet

---

## Contract Deployment on MATE

**KoilenService**: [0x8DD57a31a4b21FD0000351582e28E50600194f74](https://sepolia.etherscan.io/address/0x8DD57a31a4b21FD0000351582e28E50600194f74)

**MATE Metaprotocol Integration**:
- EVVM (MATE): 0xF817e9ad82B4a19F00dA7A248D9e556Ba96e6366
- NameService (MATE): 0x8038e87dc67D87b31d890FD01E855a8517ebfD24
- EVVM ID: 2

**Status**: Deployed & Verified on Etherscan

---

## What is Koilen?

Koilen is an IoT sensor monitoring platform that provides immutable, blockchain-based logging for temperature and humidity sensors in industrial refrigeration systems.

### Key Innovation

Uses EVVM blockchain-within-blockchain architecture to create a scalable, gasless IoT monitoring solution perfect for industrial applications.

---

## Prize Categories

### 1. Custom Service Prize ($2,500)

**Implementation**: Complete custom service built on MATE Metaprotocol

**Features**:
- Hierarchical identity management (Client → Branch → Sensor)
- Credit-based event logging system (KOIL tokens)
- 8 event types with variable costs (0-5 KOIL)
- Integration with MATE NameService for identity validation
- Production-ready smart contract architecture

**Why it qualifies**:
- Novel use case: IoT monitoring with blockchain immutability
- Custom token economics (KOIL credit system)
- Real-world industrial application
- Complete hierarchical data structure

### 2. MATE Metaprotocol Use ($2,500 shared)

**Integration**:
- Deployed on MATE Metaprotocol (EVVM ID 2)
- Uses official MATE NameService for identity validation
- Ready for MATE Fishers gasless transactions
- Leverages EVVM's blockchain-within-blockchain for scalability

**Why it qualifies**:
- Full integration with MATE infrastructure
- Uses NameService for decentralized identity
- Designed for gasless operation via Fishers
- Demonstrates EVVM's potential for IoT

### 3. Best Integration ($2,500)

**Technical Excellence**:
- Seamless MATE NameService integration
- Clean smart contract architecture
- Comprehensive event system
- Hierarchical data model
- Complete documentation

**Production Ready**:
- Verified contract on Etherscan
- Comprehensive testing suite
- Multiple deployment options
- Complete documentation (7 guides)

---

## Technical Architecture

### Smart Contract: KoilenService.sol

```solidity
contract KoilenService {
    // MATE Metaprotocol integration
    Evvm public immutable evvm;
    INameService public immutable nameService;

    // Hierarchical structure
    struct Client {
        bool isActive;
        uint256 credits;
        uint256 creditsConsumed;
        uint256 lastRechargeTimestamp;
    }

    struct Branch {
        bool isActive;
        string clientUsername;
    }

    struct Sensor {
        bool isActive;
        string branchUsername;
        string clientUsername;
        string sensorModel;
    }

    // Event types with variable costs
    enum EventType {
        NORMAL,           // 0 KOIL
        TEMP_HIGH,        // 1 KOIL
        TEMP_LOW,         // 1 KOIL
        HUMIDITY_HIGH,    // 1 KOIL
        HUMIDITY_LOW,     // 1 KOIL
        DOOR_OPEN,        // 2 KOIL
        POWER_FAILURE,    // 5 KOIL
        SENSOR_ERROR      // 1 KOIL
    }
}
```

### Key Features

1. **Hierarchical Identity Management**
   - Client → Branch → Sensor structure
   - NameService integration for identity validation
   - Flexible organization model

2. **Credit System**
   - KOIL token-based pay-per-event
   - Variable costs by event type (0-5 KOIL)
   - Automatic credit deduction
   - Credit recharge capability

3. **Event Logging**
   - Immutable on-chain storage
   - Timestamp tracking
   - Batch processing support
   - Event type classification

4. **Access Control**
   - Admin-only client registration
   - Backend-authorized event logging
   - Secure credential management

---

## Use Cases

### Industrial Refrigeration
- Restaurant cold storage monitoring
- Pharmaceutical temperature tracking
- Food distribution centers
- Laboratory freezer monitoring
- Retail refrigeration units

### Why Blockchain?
- **Immutability**: Tamper-proof temperature logs for compliance
- **Transparency**: Auditable event history
- **Decentralization**: No single point of failure
- **Gasless**: MATE Fishers enable zero-cost transactions for sensors

---

## Event Types & Economics

| Event Type | Cost | Severity | Use Case |
|------------|------|----------|----------|
| NORMAL | 0 KOIL | Info | Regular readings |
| TEMP_HIGH | 1 KOIL | Warning | Temperature alert |
| TEMP_LOW | 1 KOIL | Warning | Temperature alert |
| HUMIDITY_HIGH | 1 KOIL | Warning | Humidity alert |
| HUMIDITY_LOW | 1 KOIL | Warning | Humidity alert |
| DOOR_OPEN | 2 KOIL | Alert | Access monitoring |
| POWER_FAILURE | 5 KOIL | Critical | System failure |
| SENSOR_ERROR | 1 KOIL | Warning | Maintenance alert |

### Economics Rationale
- Free normal readings encourage frequent monitoring
- Alerts cost more to prioritize investigation
- Critical events (power failure) have highest cost
- Prevents spam while enabling comprehensive logging

---

## MATE Metaprotocol Integration

### Why MATE?

1. **NameService Integration**
   - Decentralized identity for sensors
   - Username-based addressing
   - Metadata support for sensor information

2. **Gasless Transactions**
   - Fisher/Relayer support ready
   - Backend can sponsor sensor transactions
   - Zero cost for end-users

3. **Scalability**
   - EVVM blockchain-within-blockchain
   - Lower gas costs than mainnet
   - Purpose-built for applications like IoT

### Integration Points

```solidity
constructor(
    address _evvm,              // MATE EVVM
    address _nameService,       // MATE NameService
    address _admin,
    address _backend
) {
    evvm = Evvm(_evvm);
    nameService = INameService(_nameService);
    admin = _admin;
    backend = _backend;
}

// Identity validation
modifier identityExists(string memory username) {
    require(
        nameService.isIdentityRegistered(username),
        "Identity not registered in NameService"
    );
    _;
}
```

---

## Testing Results

### Contract Verified
- Etherscan verification: PASSED
- Contract address: 0x8DD57a31a4b21FD0000351582e28E50600194f74
- Compiler: Solidity 0.8.30
- Optimization: 300 runs

### Functionality Tested
- Client registration with credits
- Branch registration
- Sensor registration
- Event logging with credit deduction
- Credit queries
- Event retrieval
- Hierarchical relationships

### Test Data (from previous deployment)
```
Client: KoilenTest (10,000 KOIL)
  └─ Branch: KoilenTest_Lab
      └─ Sensor: KoilenTest_Lab_Sensor1
          └─ Event: TEMP_HIGH (-5°C, 1 KOIL cost)

Result: 9,999 KOIL remaining
```

---

## Documentation

Complete documentation suite created:

1. **[README.md](README.md)** - Project overview
2. **[KOILEN_README.md](KOILEN_README.md)** - Complete technical documentation
3. **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - All deployments
4. **[QUICK_TEST.md](QUICK_TEST.md)** - Testing guide
5. **[KOILEN_CLIENT_SETUP.md](KOILEN_CLIENT_SETUP.md)** - Production setup
6. **[NAMESERVICE_GUIDE.md](NAMESERVICE_GUIDE.md)** - NameService integration
7. **[KOILEN_INDEX.md](KOILEN_INDEX.md)** - Documentation navigation

---

## Quick Start

### Deploy Your Own

```bash
forge script script/DeployKoilenServiceMATE.s.sol:DeployKoilenServiceMATE \
  --rpc-url https://0xrpc.io/sep \
  --account defaultKey \
  --broadcast \
  --verify \
  --etherscan-api-key YOUR_API_KEY
```

### Test the Contract

```bash
# 1. Register a client
cast send 0x8DD57a31a4b21FD0000351582e28E50600194f74 \
  "registerClient(string,uint256)" \
  "MyClient" \
  10000000000000000000000 \
  --account defaultKey \
  --rpc-url https://0xrpc.io/sep

# 2. Register a branch
cast send 0x8DD57a31a4b21FD0000351582e28E50600194f74 \
  "registerBranch(string,string)" \
  "MyClient_Branch1" \
  "MyClient" \
  --account defaultKey \
  --rpc-url https://0xrpc.io/sep

# 3. Register a sensor
cast send 0x8DD57a31a4b21FD0000351582e28E50600194f74 \
  "registerSensor(string,string,string)" \
  "MyClient_Branch1_Sensor1" \
  "MyClient_Branch1" \
  "MyClient" \
  --account defaultKey \
  --rpc-url https://0xrpc.io/sep

# 4. Log an event
cast send 0x8DD57a31a4b21FD0000351582e28E50600194f74 \
  "logSensorEvent(string,int256,uint64,uint8,bytes32)" \
  "MyClient_Branch1_Sensor1" \
  -5000000 \
  $(date +%s) \
  1 \
  0x0000000000000000000000000000000000000000000000000000000000000001 \
  --account defaultKey \
  --rpc-url https://0xrpc.io/sep
```

---

## Future Roadmap

### Phase 1: Frontend (Next.js)
- Dashboard for sensor management
- Real-time event visualization
- Credit management interface
- Analytics and reporting

### Phase 2: Backend API
- REST API for IoT devices
- Automatic transaction signing
- Batch event processing
- Queue management

### Phase 3: Fisher Integration
- Gasless transactions for sensors
- Backend-sponsored operations
- Zero-cost user experience

### Phase 4: Multi-Chain
- Deploy on other EVVM instances
- Cross-chain credit bridging
- Multi-network monitoring

---

## Technical Highlights

### Smart Contract Security
- Access control (admin/backend separation)
- Identity validation via NameService
- Credit balance checks
- Event emission for transparency
- Immutable core logic

### Gas Optimization
- Efficient storage patterns
- Batch processing support
- Optimized compiler settings (300 runs)
- Minimal on-chain computation

### Developer Experience
- Clean, readable code
- Comprehensive documentation
- Multiple testing options
- Copy-paste deployment commands

---

## Why Koilen Deserves to Win

### 1. Real-World Problem
Addresses actual industrial need for immutable temperature monitoring in:
- Food safety compliance
- Pharmaceutical storage
- Laboratory equipment
- Cold chain logistics

### 2. Novel Use of EVVM
- Demonstrates blockchain-within-blockchain for IoT
- Showcases NameService for device identity
- Ready for Fisher gasless transactions
- Scalable architecture

### 3. Production Ready
- Deployed and verified
- Comprehensive testing
- Complete documentation
- Real-world use case

### 4. Technical Excellence
- Clean smart contract design
- Hierarchical data model
- Variable cost economics
- Security best practices

### 5. Complete Package
- Smart contracts
- Deployment scripts
- Testing suite
- Documentation (7 guides)
- Hackathon-ready

---

## Repository

**GitHub**: https://github.com/mexiweb3/Koilen

**Directories**:
- `/src/contracts/koilen/` - Smart contracts
- `/script/` - Deployment scripts
- `/docs/` - Complete documentation

---

## Contact

**Team**: mexiweb3
**Project**: Koilen IoT Monitoring
**EVVM**: MATE Metaprotocol (ID: 2)
**Contract**: 0x8DD57a31a4b21FD0000351582e28E50600194f74

---

## Links

- **Contract**: https://sepolia.etherscan.io/address/0x8DD57a31a4b21FD0000351582e28E50600194f74
- **MATE EVVM**: https://sepolia.etherscan.io/address/0xF817e9ad82B4a19F00dA7A248D9e556Ba96e6366
- **MATE NameService**: https://sepolia.etherscan.io/address/0x8038e87dc67D87b31d890FD01E855a8517ebfD24
- **Documentation**: [KOILEN_INDEX.md](KOILEN_INDEX.md)

---

**Built with MATE Metaprotocol** | **EVVM ID: 2** | **Production Ready**
