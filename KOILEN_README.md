# Koilen - IoT Sensor Monitoring on EVVM

Koilen is an IoT sensor monitoring platform built on top of EVVM (Ethereum Virtual Machine Virtualization) that provides immutable, blockchain-based logging for temperature and humidity sensors in industrial refrigeration systems.

## Overview

Koilen leverages EVVM's decentralized identity system (NameService) to create a hierarchical structure for managing IoT sensors and their data:

```
Cliente (Client)
  └─ Sucursal (Branch)
      └─ Sensor (Device)
```

Each sensor event is logged on-chain with a credit-based payment system using KOIL tokens, ensuring data integrity and enabling transparent monitoring of industrial refrigeration systems.

## Architecture

### Smart Contracts

#### 1. KoilenService.sol (Production)
**Address**: [0x927e11039EbDE25095b3C413Ef35981119e3f257](https://sepolia.etherscan.io/address/0x927e11039EbDE25095b3C413Ef35981119e3f257)

Full production contract with NameService integration for identity validation.

**Features**:
- NameService identity validation
- Hierarchical client-branch-sensor structure
- Credit-based event logging
- 8 event types with different costs
- Client activation/deactivation
- Backend authorization

#### 2. KoilenServiceTest.sol (Testing)
**Address**: [0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642](https://sepolia.etherscan.io/address/0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642)

Simplified version for quick testing without NameService validation.

**Features**:
- Same functionality as KoilenService
- No NameService validation (faster testing)
- Simplified registration process

### Event Types & Costs

| Event Type | Cost (KOIL) | Description |
|-----------|-------------|-------------|
| NORMAL | 0 | Normal sensor reading |
| TEMP_HIGH | 1 | Temperature too high |
| TEMP_LOW | 1 | Temperature too low |
| HUMIDITY_HIGH | 1 | Humidity too high |
| HUMIDITY_LOW | 1 | Humidity too low |
| DOOR_OPEN | 2 | Door opened |
| POWER_FAILURE | 5 | Power failure detected |
| SENSOR_ERROR | 1 | Sensor malfunction |

### EVVM Integration

**EVVM Instance**: [0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5](https://sepolia.etherscan.io/address/0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5)
- **EVVM ID**: 1074
- **Network**: Ethereum Sepolia
- **NameService**: [0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3](https://sepolia.etherscan.io/address/0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3)

## Quick Start

### Prerequisites

- [Foundry](https://getfoundry.sh/) (Solidity toolkit)
- [Node.js](https://nodejs.org/) v16+ (for scripts)
- ETH on Sepolia testnet
- Foundry wallet configured

### 1. Clone Repository

```bash
git clone https://github.com/mexiweb3/Koilen.git
cd Koilen/Testnet-Contracts
npm install
```

### 2. Environment Setup

Create `.env` file:
```bash
RPC_URL_ETH_SEPOLIA=https://0xrpc.io/sep
ETHERSCAN_API=<your_etherscan_api_key>
```

### 3. Import Wallet

```bash
cast wallet import defaultKey --interactive
```

## Testing with KoilenServiceTest

For quick testing without NameService complexity, use KoilenServiceTest:

### Register Test Client

```bash
# Register client with 10,000 KOIL credits
cast send 0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642 \
  "registerClient(string,uint256)" \
  "KoilenTest" \
  10000000000000000000000 \
  --account defaultKey \
  --rpc-url https://0xrpc.io/sep
```

### Register Branch

```bash
cast send 0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642 \
  "registerBranch(string,string)" \
  "KoilenTest_Lab" \
  "KoilenTest" \
  --account defaultKey \
  --rpc-url https://0xrpc.io/sep
```

### Register Sensor

```bash
cast send 0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642 \
  "registerSensor(string,string,string)" \
  "KoilenTest_Lab_Sensor1" \
  "KoilenTest_Lab" \
  "KoilenTest" \
  --account defaultKey \
  --rpc-url https://0xrpc.io/sep
```

### Log Sensor Event

```bash
# Log a temperature high event (-5°C)
cast send 0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642 \
  "logSensorEvent(string,int256,uint64,uint8,bytes32)" \
  "KoilenTest_Lab_Sensor1" \
  -5000000 \
  $(date +%s) \
  1 \
  0x0000000000000000000000000000000000000000000000000000000000000001 \
  --account defaultKey \
  --rpc-url https://0xrpc.io/sep
```

### Query Data

```bash
# Check client credits
cast call 0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642 \
  "getClientCredits(string)" \
  "KoilenTest" \
  --rpc-url https://0xrpc.io/sep

# Get sensor events
cast call 0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642 \
  "getSensorEvents(string)" \
  "KoilenTest_Lab_Sensor1" \
  --rpc-url https://0xrpc.io/sep

# Verify sensor's client
cast call 0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642 \
  "getSensorClient(string)" \
  "KoilenTest_Lab_Sensor1" \
  --rpc-url https://0xrpc.io/sep
```

## Production Setup with NameService

For production use with full NameService integration, see [KOILEN_CLIENT_SETUP.md](KOILEN_CLIENT_SETUP.md).

The production workflow involves:
1. Registering identities in NameService (2-step process with EIP-191 signatures)
2. Adding metadata to identities
3. Registering in KoilenService
4. Configuring backend for event logging

## Deployment Scripts

### Deploy KoilenService (Production)

```bash
forge script script/DeployKoilenService.s.sol:DeployKoilenService \
  --rpc-url https://0xrpc.io/sep \
  --account defaultKey \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API \
  -vvvv
```

### Deploy KoilenServiceTest (Testing)

```bash
forge script script/DeployKoilenServiceTest.s.sol:DeployKoilenServiceTest \
  --rpc-url https://0xrpc.io/sep \
  --account defaultKey \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API \
  -vvvv
```

## Interactive Setup Script

Use the interactive TypeScript setup script for guided client configuration:

```bash
tsx scripts/setup-koilen-client.ts
```

This script helps you:
- Configure client, branch, and sensor names
- Verify username availability
- Generate random numbers for NameService registration
- Save configuration to JSON file

## Repository Structure

```
Testnet-Contracts/
├── src/
│   └── contracts/
│       └── koilen/
│           ├── KoilenService.sol          # Production contract
│           └── KoilenServiceTest.sol       # Testing contract
├── script/
│   ├── DeployKoilenService.s.sol          # Production deployment
│   └── DeployKoilenServiceTest.s.sol      # Test deployment
├── scripts/
│   └── setup-koilen-client.ts             # Interactive setup
├── KOILEN_CLIENT_SETUP.md                 # Complete setup guide
└── QUICK_TEST.md                          # Quick testing notes
```

## Documentation

- **[KOILEN_CLIENT_SETUP.md](KOILEN_CLIENT_SETUP.md)** - Complete production setup guide
- **[QUICK_TEST.md](QUICK_TEST.md)** - Quick testing without NameService
- **[NAMESERVICE_GUIDE.md](NAMESERVICE_GUIDE.md)** - NameService documentation

## Smart Contract Functions

### Client Management

```solidity
// Register new client with initial credits
function registerClient(string memory clientUsername, uint256 initialCredits)

// Add credits to existing client
function topUpCredits(string memory clientUsername, uint256 amount)

// Activate/deactivate client
function activateClient(string memory clientUsername)
function deactivateClient(string memory clientUsername)

// Get client credit balance
function getClientCredits(string memory clientUsername)
    returns (uint256 balance, uint256 consumed, uint256 lastTopUp, bool isActive)
```

### Hierarchy Management

```solidity
// Register branch under client
function registerBranch(string memory branchUsername, string memory clientUsername)

// Register sensor under branch and client
function registerSensor(
    string memory sensorUsername,
    string memory branchUsername,
    string memory clientUsername
)

// Query relationships
function getSensorClient(string memory sensorUsername) returns (string memory)
function getClientSensors(string memory clientUsername) returns (bytes32[] memory)
```

### Event Logging

```solidity
// Log sensor event (backend only)
function logSensorEvent(
    string memory sensorUsername,
    int256 value,              // Temperature/humidity in micro-units
    uint64 timestamp,          // Unix timestamp
    EventType eventType,       // 0-7 (see Event Types table)
    bytes32 batchHash         // Hash of event batch
)

// Get sensor events
function getSensorEvents(string memory sensorUsername)
    returns (SensorEvent[] memory)
```

### Admin Functions

```solidity
// Set event cost (admin only)
function setEventCost(EventType eventType, uint256 cost)

// Change backend address (admin only)
function setBackendAddress(address newBackend)
```

## Events

```solidity
// Emitted when client is registered
event ClientRegistered(
    string indexed clientUsernameHash,
    address indexed owner,
    uint256 initialCredits
)

// Emitted when credits are consumed
event CreditConsumed(
    string indexed clientUsernameHash,
    uint256 amount,
    uint256 remainingBalance
)

// Emitted when sensor event is logged
event SensorEventLogged(
    bytes32 indexed sensorUsernameHash,
    bytes32 indexed sensorUsernameHashAgain,
    int256 value,
    uint64 timestamp,
    EventType eventType,
    bytes32 batchHash,
    address indexed loggedBy
)

// Emitted when branch is registered
event BranchRegistered(
    string indexed branchUsernameHash,
    string indexed clientUsernameHash,
    address indexed owner
)

// Emitted when sensor is registered
event SensorRegistered(
    string indexed sensorUsernameHash,
    string indexed branchUsernameHash,
    string indexed clientUsernameHash
)
```

## Use Cases

### Industrial Refrigeration Monitoring

Monitor temperature and humidity in:
- Restaurant cold storage
- Pharmaceutical refrigerators
- Food distribution centers
- Laboratory freezers
- Retail refrigeration units

### Features for IoT Integration

- **Immutable logs**: All sensor events stored on-chain
- **Hierarchical organization**: Clients → Branches → Sensors
- **Credit system**: Pay-per-event model with KOIL tokens
- **Event categorization**: 8 event types for different alerts
- **Batch processing**: Group events with batch hashes
- **Backend integration**: Authorized backend for event logging
- **Query capabilities**: Retrieve events by sensor or client

## Troubleshooting

### "Identity does not exist" (Production)
The identity must be registered in NameService first. Use KoilenServiceTest for testing without NameService.

### "Client not registered"
Register the client using `registerClient()` before registering branches or sensors.

### "Insufficient credits"
Add more credits to the client using `topUpCredits()`.

### "Not authorized backend"
Only the designated backend address can log events. Verify with `koilenBackend()`.

## Security Considerations

- Only admin can register clients and modify settings
- Only authorized backend can log sensor events
- NameService validation prevents identity spoofing (production)
- Credit system prevents spam and ensures sustainability
- Event data is immutable once logged

## Future Enhancements

- [ ] EIP-191 signature automation script
- [ ] Dashboard for event visualization
- [ ] Multi-chain deployment (Arbitrum, Polygon)
- [ ] Gasless transactions via EVVM Fishers
- [ ] Real-time event streaming
- [ ] Alert notifications system
- [ ] Historical data analytics

## Support

For issues, questions, or contributions:
- GitHub Issues: [github.com/mexiweb3/Koilen/issues](https://github.com/mexiweb3/Koilen/issues)
- Documentation: See [KOILEN_CLIENT_SETUP.md](KOILEN_CLIENT_SETUP.md)

## License

MIT License - see LICENSE file for details

## Acknowledgments

Built on top of [EVVM](https://github.com/EVVM-org/Testnet-Contracts) - Ethereum Virtual Machine Virtualization
