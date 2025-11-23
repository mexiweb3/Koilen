# Koilen - IoT Monitoring on EVVM Blockchain

## Hackathon Submission

**Project**: Koilen - Immutable IoT Sensor Monitoring Platform
**EVVM Integration**: MATE Metaprotocol (EVVM ID 2) + Custom EVVM (EVVM ID 1074)
**Network**: Ethereum Sepolia Testnet

---

## Dual EVVM Deployment Strategy

### Deployment 1: MATE Metaprotocol (Official - EVVM ID 2)

**KoilenService on MATE**: [0x8DD57a31a4b21FD0000351582e28E50600194f74](https://sepolia.etherscan.io/address/0x8DD57a31a4b21FD0000351582e28E50600194f74)

**Integration**:
- EVVM (MATE): 0xF817e9ad82B4a19F00dA7A248D9e556Ba96e6366
- NameService (MATE): 0x8038e87dc67D87b31d890FD01E855a8517ebfD24
- EVVM ID: 2
- **Status**: ✅ Deployed & Verified on Etherscan
- **Features**: Ready for Fisher gasless transactions, production-ready

### Deployment 2: Custom EVVM (EVVM ID 1074)

**Custom EVVM**: [0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5](https://sepolia.etherscan.io/address/0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5)

**Infrastructure**:
- Custom NameService: 0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3
- EVVM ID: 1074
- **Status**: ✅ Registered in EVVM Registry
- **Features**: Custom infrastructure, full control over identity system

**KoilenService on Custom EVVM**: [0x927e11039EbDE25095b3C413Ef35981119e3f257](https://sepolia.etherscan.io/address/0x927e11039EbDE25095b3C413Ef35981119e3f257)

**Integration**:
- Uses Custom EVVM (EVVM ID 1074)
- Uses Custom NameService
- **Status**: ✅ Deployed & Verified on Etherscan
- **Features**: Independent infrastructure, custom configuration

### Deployment 3: Public Test Contract (Multi-Wallet Demo)

**KoilenServiceTestPublic**: [0x21eaC0883E57D0F0a6D81C8cF6E27b68164a4CeE](https://sepolia.etherscan.io/address/0x21eaC0883E57D0F0a6D81C8cF6E27b68164a4CeE)

**Purpose**: Public demo contract for hackathon judges and multi-wallet testing

**Features**:
- **Multi-Wallet Access**: ANY wallet can register clients, branches, sensors
- **Public Event Logging**: ANY wallet can log events for any sensor
- **No Ownership Validation**: Perfect for testing with multiple wallets
- **Credit Tracking**: Still tracks KOIL credits and deductions
- **Status**: ✅ Deployed & Verified on Etherscan

**Test Data**:
- Client: `KoilenTest` (10,000 KOIL credits)
- Sensor: `KoilenTest_Lab_Sensor1`
- Creator: 0x69c13cbfFC6Fb9FF93F9371853Da50f737055b89

**Live Dashboard**: Deploy to Vercel for live demo
- Connect with any wallet
- Log temperature/humidity events
- See real-time credit deductions
- View events on Etherscan

### Why Three Deployments?

1. **MATE Deployment**: Demonstrates integration with official EVVM ecosystem
2. **Custom EVVM**: Shows complete EVVM deployment from scratch (infrastructure + service)
3. **Public Test Contract**: Enables easy testing for hackathon judges with any wallet
4. **Flexibility**: Provides options for different use cases and requirements
5. **Comparison**: Allows testing and comparing all three approaches

---

## What is Koilen?

Koilen is an IoT sensor monitoring platform that provides immutable, blockchain-based logging for temperature and humidity sensors in industrial refrigeration systems.

### Key Innovation

Uses EVVM blockchain-within-blockchain architecture to create a scalable, gasless IoT monitoring solution perfect for industrial applications.

---

## Prize Categories

### 1. Custom Service Prize ($2,500)

**Implementation**: Complete custom service built on **TWO EVVM instances**

**Deployments**:
1. **MATE Metaprotocol** (EVVM ID 2) - Official ecosystem integration
2. **Custom EVVM** (EVVM ID 1074) - Complete infrastructure from scratch

**Features**:
- Hierarchical identity management (Client → Branch → Sensor)
- Credit-based event logging system (KOIL tokens)
- 8 event types with variable costs (0-5 KOIL)
- Dual NameService integration (MATE + Custom)
- Production-ready smart contract architecture
- Production frontend (Koilen Dashboard) with Web3 integration

**Why it qualifies**:
- Novel use case: IoT monitoring with blockchain immutability
- **TWO complete EVVM deployments** (infrastructure + service)
- Custom EVVM deployment (EVVM + NameService + KoilenService)
- Custom token economics (KOIL credit system)
- Real-world industrial application
- Complete hierarchical data structure
- Registered in EVVM Registry (EVVM ID 1074)

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

## EVVM Infrastructure Deployment

### Custom EVVM Deployment (EVVM ID 1074)

**Complete Infrastructure Stack**:

1. **EVVM Contract**: 0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5
   - Deployed using official EVVM factory
   - Registered in EVVM Registry
   - EVVM ID: 1074
   - Full blockchain-within-blockchain functionality

2. **Custom NameService**: 0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3
   - Identity management system
   - Username-based addressing
   - Metadata support
   - Full integration with Custom EVVM

3. **KoilenService**: 0x927e11039EbDE25095b3C413Ef35981119e3f257
   - IoT monitoring application
   - Uses Custom EVVM infrastructure
   - Custom NameService validation
   - Independent from MATE

**Deployment Process**:
```bash
# 1. Deploy EVVM
forge script script/DeployEVVM.s.sol --broadcast

# 2. Register in EVVM Registry
# Registered as EVVM ID 1074

# 3. Deploy NameService
forge script script/DeployNameService.s.sol --broadcast

# 4. Deploy KoilenService
forge script script/DeployKoilenService.s.sol --broadcast
```

### MATE Metaprotocol Integration (EVVM ID 2)

**Why MATE?**

1. **Official Ecosystem**
   - Production-ready infrastructure
   - MATE NameService integration
   - Fisher support for gasless transactions

2. **NameService Integration**
   - Decentralized identity for sensors
   - Username-based addressing
   - Metadata support for sensor information

3. **Gasless Transactions**
   - Fisher/Relayer support ready
   - Backend can sponsor sensor transactions
   - Zero cost for end-users

4. **Scalability**
   - EVVM blockchain-within-blockchain
   - Lower gas costs than mainnet
   - Purpose-built for applications like IoT

### Integration Points (Both EVVMs)

```solidity
constructor(
    address _evvm,              // MATE EVVM or Custom EVVM
    address _nameService,       // MATE NameService or Custom NameService
    address _admin,
    address _backend
) {
    evvm = Evvm(_evvm);
    nameService = INameService(_nameService);
    admin = _admin;
    backend = _backend;
}

// Identity validation (works with both NameService instances)
modifier identityExists(string memory username) {
    require(
        nameService.isIdentityRegistered(username),
        "Identity not registered in NameService"
    );
    _;
}
```

### Deployment Comparison

| Feature | MATE (EVVM ID 2) | Custom (EVVM ID 1074) | Public Test |
|---------|------------------|------------------------|-------------|
| **EVVM** | Official MATE | Custom deployed | Placeholder (test) |
| **NameService** | MATE NameService | Custom NameService | None (public access) |
| **Fisher Support** | ✅ Ready | ⚙️ Configurable | N/A |
| **Control** | Shared ecosystem | Full control | Open access |
| **Use Case** | Production/Hackathon | Custom requirements | Demo/Testing |
| **Verification** | ✅ Verified | ✅ Verified | ✅ Verified |
| **Multi-Wallet** | ❌ Owner only | ❌ Owner only | ✅ Any wallet |
| **Dashboard** | Compatible | Compatible | ✅ Active |

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

## Frontend Application

### Koilen Dashboard ✅ PRODUCTION READY
- **Location**: `koilen-dashboard/`
- **Status**: Production-ready and Vercel-deployable
- **Access**: http://localhost:3003 (dev) | Vercel (production)
- **Contract**: Public Test Contract (Multi-Wallet) - `0x21eaC0883E57D0F0a6D81C8cF6E27b68164a4CeE`

**Features**:
- Standalone IoT sensor monitoring interface
- RainbowKit + Wagmi v3 wallet integration
- **Multi-Wallet Support**: ANY wallet can log events (perfect for demos!)
- Temperature and humidity monitoring interface
- Auto-detection of event types based on thresholds
- Support for 8 event types with real-time cost calculation
- Real-time credit balance tracking (via `getClient()`)
- Recent events display with color-coded icons
- Statistics sidebar
- Etherscan transaction links

**Tech Stack**:
- Next.js 16.0.3 with Turbopack
- Wagmi v3 for Web3 interactions
- TypeScript
- RainbowKit wallet connections
- Tailwind CSS v4
- Vercel-ready deployment configuration

**Event Thresholds**:
- TEMP_HIGH: > 10°C (1 KOIL)
- TEMP_LOW: < -10°C (1 KOIL)
- HUMIDITY_HIGH: > 80% (1 KOIL)
- HUMIDITY_LOW: < 30% (1 KOIL)
- NORMAL: Otherwise (0 KOIL)
- DOOR_OPEN: Manual (2 KOIL)
- POWER_FAILURE: Manual (5 KOIL)
- SENSOR_ERROR: Manual (1 KOIL)

**Deployment**:
- Configured for Vercel with `serverExternalPackages`
- Local build tested and working
- Production-ready with complete documentation
- See [koilen-dashboard/DEPLOY.md](koilen-dashboard/DEPLOY.md)

### Phase 4: Fisher Integration
- Gasless transactions for sensors
- Backend-sponsored operations
- Zero-cost user experience

### Phase 5: Multi-Chain
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

### 2. Complete EVVM Ecosystem Deployment ⭐
- **Deployed Custom EVVM** (EVVM ID 1074) - Complete infrastructure from scratch
- **Deployed on MATE** (EVVM ID 2) - Integration with official ecosystem
- **Custom NameService** - Full identity management system
- **Dual deployment strategy** - Demonstrates both approaches
- **Registered in EVVM Registry** - Official EVVM ID assignment
- Shows mastery of entire EVVM stack

### 3. Novel Use of EVVM
- Demonstrates blockchain-within-blockchain for IoT
- **Built complete EVVM infrastructure** (not just using existing)
- Showcases NameService for device identity (both MATE and Custom)
- Ready for Fisher gasless transactions
- Scalable architecture on TWO EVVMs

### 4. Production Ready
- **3 verified contracts** (Custom EVVM, NameService, KoilenService)
- Deployed on both MATE and Custom EVVM
- Comprehensive testing on both instances
- Complete documentation
- Real-world use case

### 5. Technical Excellence
- **Complete EVVM deployment** from scratch
- Clean smart contract design
- Hierarchical data model
- Variable cost economics
- Security best practices
- Dual NameService integration

### 6. Complete Package
- **Custom EVVM infrastructure** (EVVM + NameService)
- **3 Smart contract deployments** (MATE + Custom + Test)
- Frontend applications (2)
- Deployment scripts for all components
- Testing suite
- Documentation (8 guides)
- Hackathon-ready on TWO EVVMs

---

## Repository

**GitHub**: https://github.com/mexiweb3/Koilen

**Directories**:
- `/src/contracts/koilen/` - Smart contracts
- `/script/` - Deployment scripts
- `/koilen-dashboard/` - Production-ready Koilen IoT Dashboard
- `/docs/` - Complete documentation (8 guides)

---

## Contact

**Team**: mexiweb3
**Project**: Koilen IoT Monitoring
**EVVM**: MATE Metaprotocol (ID: 2)
**Contract**: 0x8DD57a31a4b21FD0000351582e28E50600194f74

---

## Links

### MATE Metaprotocol (EVVM ID 2)
- **KoilenService**: https://sepolia.etherscan.io/address/0x8DD57a31a4b21FD0000351582e28E50600194f74
- **MATE EVVM**: https://sepolia.etherscan.io/address/0xF817e9ad82B4a19F00dA7A248D9e556Ba96e6366
- **MATE NameService**: https://sepolia.etherscan.io/address/0x8038e87dc67D87b31d890FD01E855a8517ebfD24

### Custom EVVM (EVVM ID 1074)
- **Custom EVVM**: https://sepolia.etherscan.io/address/0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5
- **Custom NameService**: https://sepolia.etherscan.io/address/0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3
- **KoilenService**: https://sepolia.etherscan.io/address/0x927e11039EbDE25095b3C413Ef35981119e3f257

### Documentation
- **Main Index**: [KOILEN_INDEX.md](KOILEN_INDEX.md)
- **Frontend Quickstart**: [FRONTEND_QUICKSTART.md](FRONTEND_QUICKSTART.md)
- **Deployment Summary**: [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)

---

**Built with MATE Metaprotocol + Custom EVVM** | **Dual EVVM Deployment** | **Production Ready**
