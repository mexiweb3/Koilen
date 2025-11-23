# Koilen Frontend - Quick Start Guide

**Get the Koilen IoT Dashboard running in 5 minutes**

---

## 📦 What's Included

Koilen includes **1 production-ready frontend**:

- **Koilen Dashboard** (Port 3002) - Standalone IoT monitoring interface

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Navigate to project root
cd Testnet-Contracts

# Install Koilen Dashboard dependencies
cd koilen-dashboard
npm install --legacy-peer-deps
```

### 2. Start the Dashboard

```bash
cd koilen-dashboard
npm run dev
```

✅ Access at: http://localhost:3002

---

## 📊 Koilen Dashboard Overview

### Simple IoT Monitoring Interface

**Purpose**: Dedicated IoT sensor monitoring and event logging
**Contract**: Test Contract (0x0EA04...) - No NameService required
**Target Users**: End-users & operators
**Features**: Real-time sensor monitoring, event logging, credit tracking

---

## 📱 Using Koilen Dashboard (Port 3002)

### Getting Started

1. **Open browser**: http://localhost:3002
2. **Connect wallet**: Click "Connect Wallet"
3. **Badge shows**: "Test Contract (No NameService)" in blue

### Configuration

**Current Setup**:
- Contract: `0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642` (KoilenServiceTest)
- No NameService validation required
- Simplified testing environment

### Log Events

1. **Default sensor**: `KoilenTest_Lab_Sensor1`
2. **Default client**: `KoilenTest`
3. **Adjust readings**:
   - Temperature: Use slider or input (-50°C to 50°C)
   - Humidity: 0-100%
4. **See detection**: Event type auto-updates based on readings
5. **View cost**: KOIL cost displayed before submission
6. **Submit**: Click "Log Event"

### Dashboard Features

- **Real-time credit balance**: Shows client KOIL credits
- **Recent events**: Last 10 events displayed with timestamps
- **Statistics**: Events logged and credits remaining
- **Color coding**:
  - 🟢 Green = Normal events
  - 🟡 Yellow = Alert events
  - 🔴 Red = Critical events (Power Failure)
- **Auto-detection**: Event type automatically determined from sensor readings

---

## 🔧 Prerequisites for Production Use

### Before Logging Events on Production Contracts

**For Custom EVVM (0x927e...)** or **MATE (0x8DD5...)**:

You need to register hierarchy: Client → Branch → Sensor

```bash
# 1. Register Client with 10,000 KOIL
cast send <CONTRACT_ADDRESS> \
  "registerClient(string,uint256)" \
  "KoilenTest" \
  10000000000000000000000 \
  --account defaultKey \
  --rpc-url https://0xrpc.io/sep

# 2. Register Branch
cast send <CONTRACT_ADDRESS> \
  "registerBranch(string,string)" \
  "KoilenTest_Lab" \
  "KoilenTest" \
  --account defaultKey \
  --rpc-url https://0xrpc.io/sep

# 3. Register Sensor
cast send <CONTRACT_ADDRESS> \
  "registerSensor(string,string,string)" \
  "KoilenTest_Lab_Sensor1" \
  "KoilenTest_Lab" \
  "KoilenTest" \
  --account defaultKey \
  --rpc-url https://0xrpc.io/sep
```

**Note**: For Custom EVVM (`0x927e...`), you also need NameService registration for each identity.

### For Test Contract (0x0EA04...)

✅ **No NameService required** - Direct registration works
✅ **Default setup** - Dashboard uses this contract

---

## 🌐 Contract Addresses

### MATE Metaprotocol (EVVM ID 2)
```
KoilenService: 0x8DD57a31a4b21FD0000351582e28E50600194f74
MATE EVVM:     0xF817e9ad82B4a19F00dA7A248D9e556Ba96e6366
NameService:   0x8038e87dc67D87b31d890FD01E855a8517ebfD24
```

### Custom EVVM (EVVM ID 1074)
```
KoilenService:    0x927e11039EbDE25095b3C413Ef35981119e3f257
Custom EVVM:      0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5
Custom NameService: 0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3
```

### Test Contract (No NameService) - **Dashboard Default**
```
KoilenServiceTest: 0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642
```

---

## 📝 Event Types & Costs

| Event Type | Code | Cost | Detection |
|------------|------|------|-----------|
| NORMAL | 0 | 0 KOIL | -10°C ≤ temp ≤ 10°C, 30% ≤ humidity ≤ 80% |
| TEMP_HIGH | 1 | 1 KOIL | Temperature > 10°C |
| TEMP_LOW | 2 | 1 KOIL | Temperature < -10°C |
| HUMIDITY_HIGH | 3 | 1 KOIL | Humidity > 80% |
| HUMIDITY_LOW | 4 | 1 KOIL | Humidity < 30% |
| DOOR_OPEN | 5 | 2 KOIL | Manual selection |
| POWER_FAILURE | 6 | 5 KOIL | Manual selection |
| SENSOR_ERROR | 7 | 1 KOIL | Manual selection |

**Smart Cost System**: Normal readings (0 KOIL) encourage frequent monitoring while alerts trigger cost-based notifications.

---

## 🛠️ Troubleshooting

### Port Already in Use

If you see:
```
⚠ Port 3002 is in use, using port 3003 instead
```

**Solution**: The frontend will automatically use the next available port.

### "Client not registered" Error

**Problem**: Trying to log event before registering client

**Solution**: Register client, branch, and sensor first (see Prerequisites section)

### Wallet Not Connecting

1. Install MetaMask extension
2. Add Sepolia network to MetaMask
3. Get Sepolia ETH from faucet: https://sepoliafaucet.com
4. Refresh page and click "Connect Wallet"

### Transaction Failing

**Check**:
1. Sufficient Sepolia ETH for gas
2. Client has enough KOIL credits
3. Sensor is registered
4. Using correct contract address

### Build Errors on Vercel

**Problem**: Turbopack compilation errors with Web3 dependencies

**Solution**: The project includes `serverExternalPackages` configuration in `next.config.ts` to externalize problematic packages like `pino`, `thread-stream`, etc.

---

## 🎨 Dashboard UI Features

### Clean Interface

- Large sensor reading inputs with sliders
- Automatic event type display
- Credit balance monitoring
- Recent events panel with icons
- Statistics sidebar

### Color Scheme

- Blue header badge (Test Contract)
- Green for normal events
- Yellow for alerts
- Red for critical events

### Visual Feedback

- Real-time event type detection
- Color-coded event types
- Cost calculation before submission
- Transaction status updates
- Etherscan links for verification

---

## 📚 Additional Documentation

- **Production Setup**: [KOILEN_CLIENT_SETUP.md](KOILEN_CLIENT_SETUP.md)
- **Quick Testing**: [QUICK_TEST.md](QUICK_TEST.md)
- **Hackathon Details**: [HACKATHON.md](HACKATHON.md)
- **Main Documentation**: [KOILEN_README.md](KOILEN_README.md)
- **Deployment Guide**: [koilen-dashboard/DEPLOY.md](koilen-dashboard/DEPLOY.md)

---

## 🚀 Demo Workflow

### Complete End-to-End Test

1. **Start the dashboard**:
   ```bash
   cd koilen-dashboard
   npm run dev
   ```

2. **Open Dashboard** (http://localhost:3002)
   - Connect wallet (MetaMask/RainbowKit)
   - Verify "Test Contract (No NameService)" badge

3. **Test different event types**:
   - Normal: Temperature 5°C, Humidity 50%
   - TEMP_HIGH: Temperature 15°C
   - TEMP_LOW: Temperature -15°C
   - HUMIDITY_HIGH: Humidity 85%
   - HUMIDITY_LOW: Humidity 25%

4. **Submit events**:
   - Watch auto-detection update event type
   - See KOIL cost before submission
   - Click "Log Event"
   - Confirm in MetaMask

5. **Verify on Etherscan**:
   - Click transaction link
   - View event logs
   - Confirm sensor data

---

## 🌐 Production Deployment

### Vercel Deployment (Recommended)

The dashboard is configured for one-click Vercel deployment:

1. Push to GitHub
2. Import to Vercel: https://vercel.com/new
3. Set **Root Directory**: `koilen-dashboard`
4. Deploy

See [koilen-dashboard/VERCEL_DEPLOYMENT.md](koilen-dashboard/VERCEL_DEPLOYMENT.md) for complete guide.

### Local Build

```bash
cd koilen-dashboard
npm run build
npm start
```

---

## 📦 For Hackathon Judges/Reviewers

### Quick Test Instructions

1. **Clone repository**:
   ```bash
   git clone https://github.com/mexiweb3/Koilen.git
   cd Koilen/Testnet-Contracts
   ```

2. **Install dependencies**:
   ```bash
   cd koilen-dashboard
   npm install --legacy-peer-deps
   ```

3. **Start dashboard**:
   ```bash
   npm run dev
   ```

4. **Access**: http://localhost:3002

5. **Test logging events** (no registration required with Test Contract)

### What to Test

- ✅ Wallet connection (RainbowKit)
- ✅ Event type auto-detection
- ✅ KOIL cost calculation
- ✅ Transaction submission to Sepolia
- ✅ Etherscan verification links
- ✅ Real-time credit balance
- ✅ Recent events display

---

## 🔗 Technology Stack

- **Framework**: Next.js 16.0.3 with Turbopack
- **Wallet**: RainbowKit + Wagmi v3
- **Network**: Ethereum Sepolia Testnet
- **Smart Contracts**: EVVM-based architecture
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel-ready

---

**Built with ❤️ on EVVM** | **Network**: Ethereum Sepolia | **Status**: Production Ready ✅
