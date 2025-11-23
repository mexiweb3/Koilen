# Koilen - IoT Monitoring on EVVM Blockchain

> Immutable sensor data logging for industrial refrigeration systems

[![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-blue)](https://sepolia.etherscan.io)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-orange)](https://soliditylang.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🎯 What is Koilen?

Koilen is an IoT sensor monitoring platform built on EVVM (Ethereum Virtual Machine Virtualization) that provides **immutable, blockchain-based logging** for temperature and humidity sensors in industrial refrigeration systems.

### Key Features

- ✅ **Immutable Event Logs**: All sensor readings stored permanently on-chain
- ✅ **Hierarchical Structure**: Client → Branch → Sensor organization
- ✅ **Credit System**: Pay-per-event with KOIL tokens (0-5 KOIL per event)
- ✅ **8 Event Types**: Normal, alerts, and errors with different costs
- ✅ **Decentralized Identity**: Integration with EVVM NameService
- ✅ **Production Ready**: Deployed and verified on Ethereum Sepolia

---

## 🏆 Hackathon Submission

Koilen is submitted to the **EVVM Hackathon** with a **dual deployment strategy** that showcases complete EVVM ecosystem mastery:

### Two Complete EVVM Deployments

**1. MATE Metaprotocol (EVVM ID 2)**
- Official EVVM ecosystem integration
- KoilenService: [0x8DD57a31a4b21FD0000351582e28E50600194f74](https://sepolia.etherscan.io/address/0x8DD57a31a4b21FD0000351582e28E50600194f74)
- Production-ready IoT monitoring on established infrastructure

**2. Custom EVVM (EVVM ID 1074)**
- Complete infrastructure deployed from scratch
- Custom EVVM + NameService + KoilenService
- Full control over governance and parameters

### Hackathon Highlights

- ✅ **Dual EVVM Strategy**: Deployed on both MATE (official) and Custom EVVM (ID 1074)
- ✅ **Complete Infrastructure**: Built entire EVVM ecosystem including NameService
- ✅ **Production Frontend**: Koilen Dashboard with RainbowKit wallet integration
- ✅ **8 Documentation Guides**: Comprehensive technical documentation
- ✅ **Production Ready**: All contracts verified on Etherscan
- ✅ **Real-world Use Case**: Industrial IoT sensor monitoring with credit system

📄 **For complete hackathon details, technical architecture, and competitive advantages, see [HACKATHON.md](HACKATHON.md)**

---

## 🚀 Quick Start

### For Testing (Fastest)

```bash
# Register a test client with 10,000 KOIL
cast send 0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642 \
  "registerClient(string,uint256)" \
  "MyTestClient" \
  10000000000000000000000 \
  --account defaultKey \
  --rpc-url https://0xrpc.io/sep
```

**See**: [QUICK_TEST.md](QUICK_TEST.md) for complete testing guide

### For Production

Follow the complete setup guide with NameService integration:

**See**: [KOILEN_CLIENT_SETUP.md](KOILEN_CLIENT_SETUP.md)

---

## 📚 Documentation

### Essential Reading

1. **[KOILEN_INDEX.md](KOILEN_INDEX.md)** - Documentation index and navigation guide
2. **[KOILEN_README.md](KOILEN_README.md)** - Complete project documentation
3. **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - All contract addresses and commands
4. **[QUICK_TEST.md](QUICK_TEST.md)** - Quick testing without NameService
5. **[FRONTEND_QUICKSTART.md](FRONTEND_QUICKSTART.md)** ⭐ **NEW** - Get frontends running in 5 minutes
6. **[FRONTEND_README.md](FRONTEND_README.md)** - Complete frontend documentation

### Advanced

7. **[KOILEN_CLIENT_SETUP.md](KOILEN_CLIENT_SETUP.md)** - Production setup guide
8. **[NAMESERVICE_GUIDE.md](NAMESERVICE_GUIDE.md)** - Identity system documentation
9. **[HACKATHON.md](HACKATHON.md)** - Hackathon submission details

---

## 🏗️ Architecture

### Smart Contracts

#### Production Contract
**KoilenService**: [0x927e11039EbDE25095b3C413Ef35981119e3f257](https://sepolia.etherscan.io/address/0x927e11039EbDE25095b3C413Ef35981119e3f257)
- Full NameService validation
- Production-ready
- Identity verification

#### Test Contract
**KoilenServiceTest**: [0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642](https://sepolia.etherscan.io/address/0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642)
- No NameService validation
- Quick testing
- Same functionality

### EVVM Infrastructure

- **EVVM**: [0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5](https://sepolia.etherscan.io/address/0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5)
- **NameService**: [0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3](https://sepolia.etherscan.io/address/0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3)
- **EVVM ID**: 1074

---

## 💡 Use Cases

### Industrial Refrigeration
- Restaurant cold storage monitoring
- Pharmaceutical temperature tracking
- Food distribution centers
- Laboratory freezer monitoring
- Retail refrigeration units

### Event Types

| Type | Cost | Use Case |
|------|------|----------|
| NORMAL | 0 KOIL | Regular readings |
| TEMP_HIGH/LOW | 1 KOIL | Temperature alerts |
| HUMIDITY_HIGH/LOW | 1 KOIL | Humidity alerts |
| DOOR_OPEN | 2 KOIL | Door monitoring |
| POWER_FAILURE | 5 KOIL | Critical alerts |
| SENSOR_ERROR | 1 KOIL | Maintenance alerts |

---

## 🔧 Development

### Prerequisites

- [Foundry](https://getfoundry.sh/) (Solidity toolkit)
- [Node.js](https://nodejs.org/) v16+
- Ethereum Sepolia testnet ETH

### Installation

```bash
git clone https://github.com/mexiweb3/Koilen.git
cd Koilen/Testnet-Contracts
npm install
```

### Environment Setup

```bash
# Create .env file
RPC_URL_ETH_SEPOLIA=https://0xrpc.io/sep
ETHERSCAN_API=<your_api_key>

# Import wallet
cast wallet import defaultKey --interactive
```

### Compile

```bash
forge build
```

### Deploy

```bash
# Test version (no NameService)
forge script script/DeployKoilenServiceTest.s.sol:DeployKoilenServiceTest \
  --rpc-url https://0xrpc.io/sep \
  --account defaultKey \
  --broadcast \
  --verify

# Production version (with NameService)
forge script script/DeployKoilenService.s.sol:DeployKoilenService \
  --rpc-url https://0xrpc.io/sep \
  --account defaultKey \
  --broadcast \
  --verify
```

---

## 📊 Project Status

### Deployed Contracts
- ✅ KoilenService (Production)
- ✅ KoilenServiceTest (Testing)
- ✅ EVVM Infrastructure
- ✅ All contracts verified on Etherscan

### Testing
- ✅ Client registration
- ✅ Hierarchical structure
- ✅ Event logging
- ✅ Credit system
- ✅ End-to-end workflow

### Documentation
- ✅ Complete guides
- ✅ Code examples
- ✅ Quick start
- ✅ Production setup

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🔗 Links

- **GitHub**: https://github.com/mexiweb3/Koilen
- **EVVM**: https://github.com/EVVM-org/Testnet-Contracts
- **Etherscan (KoilenService)**: https://sepolia.etherscan.io/address/0x927e11039EbDE25095b3C413Ef35981119e3f257
- **Etherscan (KoilenServiceTest)**: https://sepolia.etherscan.io/address/0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642

---

## 📞 Support

- **Documentation**: See [KOILEN_INDEX.md](KOILEN_INDEX.md)
- **Issues**: https://github.com/mexiweb3/Koilen/issues

---

**Built with ❤️ on EVVM** | **Network**: Ethereum Sepolia | **Status**: Production Ready ✅
