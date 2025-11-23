# Koilen Frontend - Quick Start Guide

**Get the Koilen IoT frontends running in 5 minutes**

---

## 📦 What's Included

Koilen includes **2 frontend applications**:

1. **EVVM Signature Constructor** (Port 3000) - Full EVVM toolkit + Koilen IoT
2. **Koilen Dashboard** (Port 3002) - Standalone IoT monitoring interface

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Navigate to project root
cd Testnet-Contracts

# Install EVVM Signature Constructor dependencies
cd EVVM-Signature-Constructor-Front
npm install --legacy-peer-deps

# Install Koilen Dashboard dependencies
cd ../koilen-dashboard
npm install --legacy-peer-deps
```

### 2. Start Both Frontends

**Terminal 1 - EVVM Signature Constructor:**
```bash
cd EVVM-Signature-Constructor-Front
npm run dev
```
✅ Access at: http://localhost:3000

**Terminal 2 - Koilen Dashboard:**
```bash
cd koilen-dashboard
npm run dev
```
✅ Access at: http://localhost:3002

---

## 🎯 Frontend Comparison

| Feature | EVVM Constructor (3000) | Koilen Dashboard (3002) |
|---------|------------------------|------------------------|
| **Purpose** | Full EVVM development toolkit | Dedicated IoT monitoring |
| **Contract** | User-selectable (MATE or Custom) | Test Contract (0x0EA04...) |
| **Target Users** | Developers & advanced users | End-users & operators |
| **EVVM Support** | MATE + Custom EVVM (dual) | Test environment |
| **Features** | All EVVM tools + Koilen IoT | Sensor monitoring only |
| **Complexity** | Advanced | Simplified |

---

## 📱 Using EVVM Signature Constructor (Port 3000)

### Access Koilen IoT Features

1. **Open browser**: http://localhost:3000
2. **Connect wallet**: Click "Connect Wallet" (top right)
3. **Select menu**: Choose "Koilen IoT Sensors" from dropdown
4. **Choose EVVM**:
   - Leave blank for currently selected EVVM
   - Or enter KoilenService address:
     - MATE: `0x8DD57a31a4b21FD0000351582e28E50600194f74`
     - Custom: `0x927e11039EbDE25095b3C413Ef35981119e3f257`

### Log Sensor Event

1. **Enter sensor info**:
   - Sensor Name: `KoilenTest_Lab_Sensor1`
   - Temperature: `-5` (°C)
   - Humidity: `65` (%)

2. **Review auto-detected event type**:
   - 🟢 NORMAL (0 KOIL) - Temperature between -10°C and 10°C
   - 🟡 TEMP_HIGH (1 KOIL) - Temperature > 10°C
   - 🟡 TEMP_LOW (1 KOIL) - Temperature < -10°C
   - 🟡 HUMIDITY_HIGH (1 KOIL) - Humidity > 80%
   - 🟡 HUMIDITY_LOW (1 KOIL) - Humidity < 30%

3. **Submit transaction**: Click "Log Event"

4. **Confirm in MetaMask**

5. **View on Etherscan**: Click transaction link when complete

---

## 📊 Using Koilen Dashboard (Port 3002)

### Simple IoT Monitoring Interface

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
   - Temperature: Use slider or input
   - Humidity: 0-100%
4. **See detection**: Event type auto-updates
5. **View cost**: KOIL cost displayed before submission
6. **Submit**: Click "Log Event"

### Features

- **Real-time credit balance**: Shows client KOIL credits
- **Recent events**: Last 10 events displayed
- **Statistics**: Events logged and credits remaining
- **Color coding**:
  - 🟢 Green = Normal
  - 🟡 Yellow = Alerts
  - 🔴 Red = Critical (Power Failure)

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

### Test Contract (No NameService)
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

---

## 🛠️ Troubleshooting

### Port Already in Use

If you see:
```
⚠ Port 3000 is in use, using port 3001 instead
```

**Solution**: The frontend will automatically use the next available port.

### "Client not registered" Error

**Problem**: Trying to log event before registering client

**Solution**: Register client, branch, and sensor first (see Prerequisites section)

### "Identity not registered" Error (Custom EVVM only)

**Problem**: NameService validation failing

**Solution**: Register identities in Custom NameService first, OR use Test Contract instead

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

---

## 🎨 UI Features

### EVVM Signature Constructor

**Menu Navigation**:
- Dropdown menu with all EVVM tools
- "Koilen IoT Sensors" option
- Dynamic component rendering

**Visual Feedback**:
- Real-time event type detection
- Color-coded event types
- Cost calculation before submission
- Transaction status updates
- Etherscan links for verification

### Koilen Dashboard

**Clean Interface**:
- Large sensor reading inputs
- Automatic event type display
- Credit balance monitoring
- Recent events panel with icons
- Statistics sidebar

**Color Scheme**:
- Blue header badge (Test Contract)
- Green for normal events
- Yellow for alerts
- Red for critical events

---

## 📚 Additional Documentation

- **Complete Frontend Guide**: [FRONTEND_README.md](FRONTEND_README.md)
- **Quick Testing**: [QUICK_TEST.md](QUICK_TEST.md)
- **Production Setup**: [KOILEN_CLIENT_SETUP.md](KOILEN_CLIENT_SETUP.md)
- **Hackathon Details**: [HACKATHON.md](HACKATHON.md)
- **Main Documentation**: [KOILEN_README.md](KOILEN_README.md)

---

## 🚀 Demo Workflow

### Complete End-to-End Test

1. **Start both frontends** (see Quick Start section)

2. **Open EVVM Constructor** (http://localhost:3000)
   - Connect wallet
   - Select "Koilen IoT Sensors"
   - Test with MATE contract: `0x8DD57a31a4b21FD0000351582e28E50600194f74`

3. **Open Koilen Dashboard** (http://localhost:3002)
   - Connect wallet
   - Adjust temperature to 15°C
   - See TEMP_HIGH detection (1 KOIL)
   - Submit event

4. **Verify on Etherscan**
   - Click transaction link
   - View event logs
   - Confirm sensor data

---

## 📦 Deployment Checklist

### For Hackathon Submission

- [x] EVVM Signature Constructor installed and running
- [x] Koilen Dashboard installed and running
- [x] Both frontends accessible via localhost
- [x] Wallet connection working (RainbowKit)
- [x] Event type auto-detection functional
- [x] Transaction submission to Sepolia working
- [x] Etherscan verification links working
- [x] Documentation complete and accessible

### For Judges/Reviewers

**To test the project**:

1. Clone repository:
   ```bash
   git clone https://github.com/mexiweb3/Koilen.git
   cd Koilen/Testnet-Contracts
   ```

2. Install dependencies:
   ```bash
   cd EVVM-Signature-Constructor-Front && npm install --legacy-peer-deps
   cd ../koilen-dashboard && npm install --legacy-peer-deps
   ```

3. Start frontends:
   ```bash
   # Terminal 1
   cd EVVM-Signature-Constructor-Front && npm run dev

   # Terminal 2
   cd koilen-dashboard && npm run dev
   ```

4. Access:
   - EVVM Constructor: http://localhost:3000
   - Koilen Dashboard: http://localhost:3002

5. Test logging events (no registration required with Test Contract)

---

**Built with ❤️ on EVVM** | **Network**: Ethereum Sepolia | **Status**: Production Ready ✅
