# Koilen Deployment Summary

## Network: Ethereum Sepolia

**Chain ID**: 11155111
**RPC URL**: https://0xrpc.io/sep
**Block Explorer**: https://sepolia.etherscan.io

---

## EVVM Infrastructure

### Core EVVM
**Address**: [0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5](https://sepolia.etherscan.io/address/0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5)
**EVVM ID**: 1074
**Status**: ✅ Deployed and Registered

### NameService
**Address**: [0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3](https://sepolia.etherscan.io/address/0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3)
**Status**: ✅ Deployed
**Features**: Identity registration with EIP-191 signatures

---

## Koilen Smart Contracts

### KoilenService (Production)
**Address**: [0x927e11039EbDE25095b3C413Ef35981119e3f257](https://sepolia.etherscan.io/address/0x927e11039EbDE25095b3C413Ef35981119e3f257)
**Deployment Date**: November 23, 2024
**Status**: ✅ Deployed and Verified
**Gas Used**: 1,486,955
**Cost**: 0.00000171000419782 ETH

**Features**:
- NameService integration
- Hierarchical client-branch-sensor structure
- Credit-based event logging
- 8 event types with configurable costs
- Admin controls

**Configuration**:
- Admin: 0x69c13cbfFC6Fb9FF93F9371853Da50f737055b89
- Backend: 0x69c13cbfFC6Fb9FF93F9371853Da50f737055b89
- EVVM: 0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5
- NameService: 0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3

### KoilenServiceTest (Testing)
**Address**: [0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642](https://sepolia.etherscan.io/address/0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642)
**Deployment Date**: November 23, 2024
**Status**: ✅ Deployed and Verified
**Gas Used**: 1,486,955
**Cost**: 0.00000171000419782 ETH

**Features**:
- Same functionality as KoilenService
- No NameService validation (for quick testing)
- Simplified registration process

**Configuration**:
- Admin: 0x69c13cbfFC6Fb9FF93F9371853Da50f737055b89
- Backend: 0x69c13cbfFC6Fb9FF93F9371853Da50f737055b89
- EVVM: 0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5

---

## Test Results (KoilenServiceTest)

### Test Client Configuration
**Client**: KoilenTest
**Initial Credits**: 10,000 KOIL
**Owner**: 0x69c13cbfFC6Fb9FF93F9371853Da50f737055b89

**Branch**: KoilenTest_Lab
**Parent**: KoilenTest

**Sensor**: KoilenTest_Lab_Sensor1
**Branch**: KoilenTest_Lab
**Client**: KoilenTest

### Test Event Logged
**Transaction**: [0x5f3cdada259d3b1a26cd6fb1b90581e6c6a8e51bf7bf9eea5208c3584fc88eaf](https://sepolia.etherscan.io/tx/0x5f3cdada259d3b1a26cd6fb1b90581e6c6a8e51bf7bf9eea5208c3584fc88eaf)
**Block**: 9687323
**Sensor**: KoilenTest_Lab_Sensor1
**Value**: -5°C
**Event Type**: TEMP_HIGH (1)
**Cost**: 1 KOIL
**Status**: ✅ Success

### Credit Balance After Event
**Remaining Credits**: 9,999 KOIL
**Consumed Credits**: 1 KOIL
**Status**: Active

---

## Event Costs Configuration

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

---

## Deployment Scripts

### Production Deployment
```bash
forge script script/DeployKoilenService.s.sol:DeployKoilenService \
  --rpc-url https://0xrpc.io/sep \
  --account defaultKey \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API \
  -vvvv
```

**File**: [script/DeployKoilenService.s.sol](script/DeployKoilenService.s.sol)

### Test Deployment
```bash
forge script script/DeployKoilenServiceTest.s.sol:DeployKoilenServiceTest \
  --rpc-url https://0xrpc.io/sep \
  --account defaultKey \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API \
  -vvvv
```

**File**: [script/DeployKoilenServiceTest.s.sol](script/DeployKoilenServiceTest.s.sol)

---

## Quick Start Commands

### Register Client
```bash
cast send 0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642 \
  "registerClient(string,uint256)" \
  "<CLIENT_NAME>" \
  10000000000000000000000 \
  --account defaultKey \
  --rpc-url https://0xrpc.io/sep
```

### Register Branch
```bash
cast send 0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642 \
  "registerBranch(string,string)" \
  "<BRANCH_NAME>" \
  "<CLIENT_NAME>" \
  --account defaultKey \
  --rpc-url https://0xrpc.io/sep
```

### Register Sensor
```bash
cast send 0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642 \
  "registerSensor(string,string,string)" \
  "<SENSOR_NAME>" \
  "<BRANCH_NAME>" \
  "<CLIENT_NAME>" \
  --account defaultKey \
  --rpc-url https://0xrpc.io/sep
```

### Log Event
```bash
cast send 0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642 \
  "logSensorEvent(string,int256,uint64,uint8,bytes32)" \
  "<SENSOR_NAME>" \
  <VALUE> \
  $(date +%s) \
  <EVENT_TYPE> \
  <BATCH_HASH> \
  --account defaultKey \
  --rpc-url https://0xrpc.io/sep
```

---

## Documentation Links

- **Main README**: [KOILEN_README.md](KOILEN_README.md)
- **Client Setup Guide**: [KOILEN_CLIENT_SETUP.md](KOILEN_CLIENT_SETUP.md)
- **Quick Test Guide**: [QUICK_TEST.md](QUICK_TEST.md)
- **NameService Guide**: [NAMESERVICE_GUIDE.md](NAMESERVICE_GUIDE.md)

---

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
├── KOILEN_README.md                       # Main documentation
├── KOILEN_CLIENT_SETUP.md                 # Setup guide
├── QUICK_TEST.md                          # Testing guide
└── DEPLOYMENT_SUMMARY.md                  # This file
```

---

## Verification Status

All contracts are verified on Etherscan:
- ✅ KoilenService: Verified
- ✅ KoilenServiceTest: Verified
- ✅ EVVM: Verified
- ✅ NameService: Verified

---

## Next Steps

### For Testing
1. Use KoilenServiceTest for rapid prototyping
2. Test different event types
3. Validate credit consumption
4. Test hierarchical queries

### For Production
1. Register identities in NameService (requires EIP-191 signatures)
2. Use KoilenService with full validation
3. Configure backend for event logging
4. Deploy dashboard for monitoring

---

## Support

**GitHub Repository**: https://github.com/mexiweb3/Koilen
**EVVM Documentation**: https://github.com/EVVM-org/Testnet-Contracts

---

**Last Updated**: November 23, 2024
**Network**: Ethereum Sepolia
**Status**: All Systems Operational ✅
