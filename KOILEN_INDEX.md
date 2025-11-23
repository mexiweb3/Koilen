# Koilen Documentation Index

Complete documentation for the Koilen IoT sensor monitoring platform on EVVM.

---

## 📚 Quick Navigation

### Getting Started
1. **[KOILEN_README.md](KOILEN_README.md)** - Start here for overview and quick start
2. **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - All deployed contract addresses and commands
3. **[QUICK_TEST.md](QUICK_TEST.md)** - Quick testing guide with KoilenServiceTest

### Frontend Applications ⭐ NEW
4. **[FRONTEND_QUICKSTART.md](FRONTEND_QUICKSTART.md)** - Get frontends running in 5 minutes
5. **[FRONTEND_README.md](FRONTEND_README.md)** - Complete frontend documentation

### Production Setup
6. **[KOILEN_CLIENT_SETUP.md](KOILEN_CLIENT_SETUP.md)** - Complete production setup with NameService

### EVVM Infrastructure
7. **[NAMESERVICE_GUIDE.md](NAMESERVICE_GUIDE.md)** - NameService identity system documentation

### Hackathon
8. **[HACKATHON.md](HACKATHON.md)** - Hackathon submission details

---

## 📖 Documentation by Task

### I want to understand Koilen
→ Start with **[KOILEN_README.md](KOILEN_README.md)**
- What is Koilen?
- Architecture overview
- Smart contracts explanation
- Event types and costs

### I want to test quickly
→ Use **[QUICK_TEST.md](QUICK_TEST.md)**
- KoilenServiceTest (no NameService validation)
- Step-by-step test commands
- Verification queries
- Test results

### I want to deploy to production
→ Follow **[KOILEN_CLIENT_SETUP.md](KOILEN_CLIENT_SETUP.md)**
- Complete production workflow
- NameService registration
- Metadata configuration
- Client hierarchy setup

### I need contract addresses
→ Check **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)**
- All deployed contracts
- Network configuration
- Quick start commands
- Test results

### I want to run the frontends
→ Use **[FRONTEND_QUICKSTART.md](FRONTEND_QUICKSTART.md)**
- 5-minute setup guide
- Both frontend applications
- Step-by-step instructions
- Troubleshooting tips

### I want to understand NameService
→ Read **[NAMESERVICE_GUIDE.md](NAMESERVICE_GUIDE.md)**
- Identity system
- EIP-191 signatures
- 2-step registration
- Metadata management

### I want hackathon details
→ Check **[HACKATHON.md](HACKATHON.md)**
- Dual EVVM deployment strategy
- Prize qualification
- Technical achievements
- Competitive advantages

---

## 🏗️ Project Structure

### Smart Contracts
```
src/contracts/koilen/
├── KoilenService.sol          # Production (with NameService validation)
└── KoilenServiceTest.sol       # Testing (no NameService validation)
```

### Deployment Scripts
```
script/
├── DeployKoilenService.s.sol          # Deploy production contract
└── DeployKoilenServiceTest.s.sol      # Deploy test contract
```

### Setup Scripts
```
scripts/
└── setup-koilen-client.ts             # Interactive client setup wizard
```

---

## 🚀 Common Workflows

### Testing Workflow
```
1. Read KOILEN_README.md (overview)
   ↓
2. Read QUICK_TEST.md (testing guide)
   ↓
3. Use DEPLOYMENT_SUMMARY.md (contract addresses)
   ↓
4. Register client → branch → sensor → log event
```

### Production Workflow
```
1. Read KOILEN_README.md (overview)
   ↓
2. Read NAMESERVICE_GUIDE.md (identity system)
   ↓
3. Follow KOILEN_CLIENT_SETUP.md (complete setup)
   ↓
4. Use DEPLOYMENT_SUMMARY.md (contract addresses)
```

---

## 📋 File Descriptions

### KOILEN_README.md
**Purpose**: Main documentation and entry point
**Contents**:
- Project overview
- Architecture explanation
- Quick start guide
- Smart contract functions
- Event types and costs
- Use cases
- Troubleshooting

**When to use**: First read for understanding Koilen

### DEPLOYMENT_SUMMARY.md
**Purpose**: Deployment information and quick reference
**Contents**:
- All contract addresses
- Network configuration
- Test results
- Quick start commands
- Repository structure

**When to use**: When you need contract addresses or quick commands

### QUICK_TEST.md
**Purpose**: Quick testing without NameService complexity
**Contents**:
- KoilenServiceTest usage
- Step-by-step test commands
- Successful test results
- Verification queries
- Technical details

**When to use**: When testing the system quickly

### KOILEN_CLIENT_SETUP.md
**Purpose**: Complete production setup guide
**Contents**:
- Deployment instructions
- NameService registration (2 steps)
- Metadata configuration
- KoilenService registration
- Credit management
- Admin functions

**When to use**: When setting up production clients

### NAMESERVICE_GUIDE.md
**Purpose**: NameService documentation
**Contents**:
- Identity system explanation
- EIP-191 signature process
- Pre-registration and registration
- Metadata management
- Username validation

**When to use**: When working with NameService identities

---

## 🔗 External Resources

### Deployed Contracts (Ethereum Sepolia)

**EVVM Infrastructure**:
- EVVM: [0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5](https://sepolia.etherscan.io/address/0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5)
- NameService: [0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3](https://sepolia.etherscan.io/address/0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3)

**Koilen Contracts**:
- KoilenService (Production): [0x927e11039EbDE25095b3C413Ef35981119e3f257](https://sepolia.etherscan.io/address/0x927e11039EbDE25095b3C413Ef35981119e3f257)
- KoilenServiceTest (Testing): [0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642](https://sepolia.etherscan.io/address/0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642)

### Repositories
- **Koilen**: https://github.com/mexiweb3/Koilen
- **EVVM**: https://github.com/EVVM-org/Testnet-Contracts

---

## ❓ Quick Answers

### What is Koilen?
IoT sensor monitoring platform for industrial refrigeration, built on EVVM blockchain.

### What is EVVM?
Ethereum Virtual Machine Virtualization - a blockchain within a smart contract.

### What is NameService?
Decentralized identity system for EVVM, similar to ENS.

### Production vs Test contract?
- **KoilenService**: Full NameService validation (production)
- **KoilenServiceTest**: No NameService validation (testing)

### How much does it cost to log events?
0-5 KOIL tokens depending on event type (see KOILEN_README.md)

### How do I get started?
1. Read KOILEN_README.md
2. Follow QUICK_TEST.md for testing
3. Use DEPLOYMENT_SUMMARY.md for addresses

---

## 📞 Support

**Issues**: https://github.com/mexiweb3/Koilen/issues
**Documentation**: This repository

---

**Last Updated**: November 23, 2024
**Version**: 1.0.0
**Network**: Ethereum Sepolia
