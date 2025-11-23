# Koilen Frontend Applications

Comprehensive guide to all frontend applications for the Koilen IoT Monitoring Platform.

---

## Table of Contents

1. [Overview](#overview)
2. [EVVM Signature Constructor Frontend](#evvm-signature-constructor-frontend)
3. [Koilen Dashboard](#koilen-dashboard)
4. [Installation & Setup](#installation--setup)
5. [Usage Guide](#usage-guide)
6. [Technical Details](#technical-details)

---

## Overview

Koilen provides two frontend applications for interacting with the KoilenService smart contract:

1. **EVVM Signature Constructor Frontend**: Full-featured EVVM toolkit with Koilen IoT integration
2. **Koilen Dashboard**: Standalone IoT sensor monitoring interface

Both applications support:
- Wallet connection via RainbowKit
- Temperature and humidity event logging
- Real-time event type detection
- Multiple contract deployments (MATE & Custom EVVM)

---

## EVVM Signature Constructor Frontend

### Location
```
EVVM-Signature-Constructor-Front/
```

### Access
```
http://localhost:3000
```

### Overview

The EVVM Signature Constructor is the official frontend toolkit for EVVM developers, now enhanced with custom Koilen IoT sensor event logging capabilities.

### Features

#### Core EVVM Toolkit
- **Faucet Functions**: Request testnet tokens and check balances
- **Payment Signatures**: Create payment transactions with EIP-191 signatures
- **Staking Signatures**: Golden, Presale, and Public staking operations
- **Name Service**: Username registration and management
- **P2P Swap**: Decentralized token swaps
- **EVVM Registry**: Register and manage EVVM instances

#### Koilen IoT Integration ⭐ NEW
- **Custom Component**: `src/components/SigConstructors/KoilenIoT/SensorEventComponent.tsx`
- **Menu Option**: "Koilen IoT Sensors"
- **Features**:
  - Temperature and humidity monitoring
  - Auto-detection of 8 event types
  - Real-time cost calculation (0-5 KOIL)
  - Color-coded visual feedback
  - Dynamic contract address selection
  - Support for MATE and Custom EVVM deployments

### Component Structure

```typescript
KoilenIoT/
└── SensorEventComponent.tsx
    ├── Props: evvmAddress
    ├── State:
    │   ├── koilenServiceAddress
    │   ├── sensorName
    │   ├── temperature
    │   └── humidity
    ├── Functions:
    │   ├── detectEventType()
    │   ├── getEventTypeName()
    │   ├── getEventColor()
    │   └── handleLogEvent()
    └── UI:
        ├── Contract Address Input
        ├── Sensor Information Display
        ├── Temperature/Humidity Inputs
        ├── Event Type Detection
        ├── Submit Button
        └── Status Messages
```

### Event Type Detection Logic

```typescript
Temperature-based:
  > 10°C  → TEMP_HIGH (1 KOIL)
  < -10°C → TEMP_LOW (1 KOIL)

Humidity-based:
  > 80%   → HUMIDITY_HIGH (1 KOIL)
  < 30%   → HUMIDITY_LOW (1 KOIL)

Otherwise → NORMAL (0 KOIL)
```

### Available Contract Addresses

**MATE Metaprotocol (EVVM ID 2)**:
```
0x8DD57a31a4b21FD0000351582e28E50600194f74
```

**Custom EVVM (EVVM ID 1074)**:
```
0x927e11039EbDE25095b3C413Ef35981119e3f257
```

**Test Deployment**:
```
0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642
```

### Tech Stack

- **Framework**: Next.js 15.3.0
- **Routing**: App Router
- **Web3**: Wagmi v2
- **Wallets**: RainbowKit
- **Language**: TypeScript
- **Styling**: Inline styles (matching EVVM patterns)
- **Blockchain**: Viem v2

### Installation

```bash
cd EVVM-Signature-Constructor-Front
npm install --legacy-peer-deps
npm run dev
```

### Usage

1. **Open Frontend**: Navigate to http://localhost:3000
2. **Connect Wallet**: Click "Connect Wallet" (RainbowKit)
3. **Select Network**: Choose Sepolia testnet
4. **Select Menu**: Choose "Koilen IoT Sensors" from dropdown
5. **Enter Contract**: Input KoilenService contract address
6. **Configure Sensor**: Set temperature and humidity values
7. **View Detection**: See auto-detected event type and cost
8. **Submit**: Click "Log Event" to submit transaction
9. **Confirm**: Approve transaction in wallet
10. **Success**: View confirmation message

### Menu Integration

The Koilen IoT component is integrated into the main menu system:

```typescript
// SigMenu.tsx
const koilenComponents = [
  <SensorEventComponent key="koilenSensor" evvmAddress={evvmAddress} />,
]

// Menu options
<option value="koilen">Koilen IoT Sensors</option>
```

---

## Koilen Dashboard

### Location
```
koilen-dashboard/
```

### Access
```
http://localhost:3001
```

### Overview

A standalone, simplified interface specifically designed for Koilen IoT sensor monitoring on the MATE Metaprotocol.

### Features

- Simplified sensor event logging UI
- MATE-specific configuration
- RainbowKit wallet integration
- Temperature/humidity monitoring
- Event type visualization

### Tech Stack

- **Framework**: Next.js 16.0.3
- **Routing**: App Router
- **Web3**: Wagmi v2
- **Wallets**: RainbowKit
- **Language**: TypeScript
- **Styling**: Tailwind CSS

### Installation

```bash
cd koilen-dashboard
npm install --legacy-peer-deps
npm run dev
```

### Usage

1. **Open Dashboard**: Navigate to http://localhost:3001
2. **Connect Wallet**: Use RainbowKit wallet connector
3. **Enter Values**: Input temperature and humidity
4. **Submit Event**: Log event to MATE contract
5. **View Status**: See transaction confirmation

---

## Installation & Setup

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH

### Global Setup

```bash
# Clone repository
git clone https://github.com/mexiweb3/Koilen.git
cd Koilen

# Install both frontends
cd EVVM-Signature-Constructor-Front && npm install --legacy-peer-deps
cd ../koilen-dashboard && npm install --legacy-peer-deps
```

### Environment Variables

Both frontends use the same configuration:

**Network**: Sepolia Testnet
**Chain ID**: 11155111
**RPC URLs**: Multiple fallbacks configured

No `.env` file needed - all configuration is in the code.

### Running Both Frontends

```bash
# Terminal 1: EVVM Frontend
cd EVVM-Signature-Constructor-Front
npm run dev
# Access at http://localhost:3000

# Terminal 2: Koilen Dashboard
cd koilen-dashboard
npm run dev
# Access at http://localhost:3001
```

---

## Usage Guide

### Complete Workflow: Log a Sensor Event

#### Step 1: Setup
```bash
1. Start frontend (EVVM or Dashboard)
2. Connect wallet to Sepolia testnet
3. Ensure you have testnet ETH
```

#### Step 2: Configure (EVVM Frontend)
```bash
1. Select "Koilen IoT Sensors" from menu
2. Enter KoilenService contract address:
   - MATE: 0x8DD57a31a4b21FD0000351582e28E50600194f74
   - Custom: 0x927e11039EbDE25095b3C413Ef35981119e3f257
```

#### Step 3: Set Values
```bash
1. Temperature: -5°C (example)
2. Humidity: 65% (example)
3. Observe auto-detected event type:
   - Temperature < -10°C → TEMP_LOW
   - Shows cost: 1 KOIL
   - Color: Yellow (warning)
```

#### Step 4: Submit
```bash
1. Click "Log Event" button
2. Confirm transaction in MetaMask
3. Wait for confirmation (~15 seconds)
4. View success message
```

#### Step 5: Verify
```bash
# Query the event
cast call 0x8DD57a31a4b21FD0000351582e28E50600194f74 \
  "getClientCredits(string)" \
  "KoilenTest" \
  --rpc-url https://0xrpc.io/sep

# Should show credits reduced by event cost
```

### Event Type Examples

**Normal Reading**:
```
Temperature: 5°C
Humidity: 50%
→ NORMAL (0 KOIL)
```

**Temperature Alert**:
```
Temperature: 15°C
Humidity: 50%
→ TEMP_HIGH (1 KOIL)
```

**Multiple Conditions**:
```
Temperature: 25°C
Humidity: 90%
→ TEMP_HIGH priority (1 KOIL)
```

---

## Technical Details

### Web3 Integration

Both frontends use the same Web3 stack:

```typescript
// Configuration
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'

const config = getDefaultConfig({
  appName: 'Koilen Dashboard',
  projectId: 'YOUR_PROJECT_ID',
  chains: [sepolia],
})

// Contract Interaction
const { writeContract, isPending, isSuccess, error } = useWriteContract()

await writeContract({
  address: contractAddress as `0x${string}`,
  abi: KOILEN_ABI,
  functionName: 'logSensorEvent',
  args: [sensorName, tempValue, timestamp, eventType, batchHash],
})
```

### ABI Definition

```typescript
const KOILEN_ABI = [
  {
    name: 'logSensorEvent',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'sensorUsername', type: 'string' },
      { name: 'value', type: 'int256' },
      { name: 'timestamp', type: 'uint64' },
      { name: 'eventType', type: 'uint8' },
      { name: 'batchHash', type: 'bytes32' }
    ],
    outputs: []
  },
  {
    name: 'getClientCredits',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'clientUsername', type: 'string' }],
    outputs: [{ name: '', type: 'uint256' }]
  }
]
```

### Data Transformations

```typescript
// Temperature conversion (°C to int256)
const tempValue = BigInt(Math.floor(temperature * 1e6))
// Example: -5°C → -5000000

// Timestamp conversion
const timestamp = BigInt(Math.floor(Date.now() / 1000))
// Example: 1700000000

// Batch hash (placeholder for future batching)
const batchHash = '0x0000000000000000000000000000000000000000000000000000000000000001'
```

### Event Type Mapping

```typescript
const EVENT_TYPES = {
  NORMAL: 0,
  TEMP_HIGH: 1,
  TEMP_LOW: 2,
  HUMIDITY_HIGH: 3,
  HUMIDITY_LOW: 4,
  DOOR_OPEN: 5,
  POWER_FAILURE: 6,
  SENSOR_ERROR: 7
}

const EVENT_COSTS: Record<number, string> = {
  0: '0',   // NORMAL
  1: '1',   // TEMP_HIGH
  2: '1',   // TEMP_LOW
  3: '1',   // HUMIDITY_HIGH
  4: '1',   // HUMIDITY_LOW
  5: '2',   // DOOR_OPEN
  6: '5',   // POWER_FAILURE
  7: '1'    // SENSOR_ERROR
}
```

### Error Handling

```typescript
try {
  await writeContract({...})
} catch (err: any) {
  console.error('Error logging event:', err)
  alert(`Error: ${err.message || 'Failed to log event'}`)
}

// Common errors:
// - "Please connect your wallet first"
// - "Please enter a KoilenService contract address"
// - "User rejected transaction"
// - "Insufficient funds"
```

### State Management

```typescript
// Local state (no global state needed)
const [koilenServiceAddress, setKoilenServiceAddress] = useState('')
const [sensorName, setSensorName] = useState('KoilenTest_Lab_Sensor1')
const [temperature, setTemperature] = useState(-5)
const [humidity, setHumidity] = useState(65)

// Wagmi hooks
const { address } = useAccount()
const { writeContract, isPending, isSuccess, error } = useWriteContract()
```

---

## Comparison: EVVM Frontend vs Koilen Dashboard

| Feature | EVVM Frontend | Koilen Dashboard |
|---------|---------------|------------------|
| **Port** | 3000 | 3001 |
| **Next.js** | 15.3.0 | 16.0.3 |
| **Scope** | Full EVVM toolkit + Koilen | Koilen-only |
| **Styling** | Inline styles | Tailwind CSS |
| **Contract Selection** | Dynamic | Hardcoded (MATE) |
| **Menu System** | Multi-function | Single-purpose |
| **Use Case** | Development toolkit | End-user monitoring |
| **Recommended For** | Developers, Testing | Production, IoT devices |

---

## Troubleshooting

### Common Issues

**"Module not found" errors**:
```bash
npm install --legacy-peer-deps
```

**Port already in use**:
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3002
```

**Wallet not connecting**:
```bash
1. Ensure MetaMask is installed
2. Switch to Sepolia testnet
3. Refresh page
4. Clear browser cache
```

**Transaction failing**:
```bash
1. Check Sepolia ETH balance
2. Verify contract address is correct
3. Ensure sensor is registered in contract
4. Check client has sufficient KOIL credits
```

**"Identity not registered" error**:
```bash
# Register sensor identity first
cast send $CONTRACT_ADDRESS \
  "registerSensor(string,string,string)" \
  "SensorName" "BranchName" "ClientName" \
  --account defaultKey \
  --rpc-url https://0xrpc.io/sep
```

---

## Development

### Adding New Features

#### Add New Event Type
```typescript
// 1. Update EVENT_TYPES enum
const EVENT_TYPES = {
  // existing types...
  NEW_TYPE: 8
}

// 2. Add cost mapping
const EVENT_COSTS: Record<number, string> = {
  // existing costs...
  8: '3'
}

// 3. Update detection logic
const detectEventType = () => {
  if (newCondition) return EVENT_TYPES.NEW_TYPE
  // existing logic...
}

// 4. Update contract enum (if adding to smart contract)
```

#### Add New Input Field
```typescript
// 1. Add state
const [newValue, setNewValue] = useState(defaultValue)

// 2. Add UI input
<input
  type="number"
  value={newValue}
  onChange={(e) => setNewValue(Number(e.target.value))}
  style={inputStyle}
/>

// 3. Use in transaction
args: [sensorName, tempValue, timestamp, eventType, batchHash, newValue]
```

### Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Type checking
npx tsc --noEmit
```

---

## Production Deployment

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy EVVM Frontend
cd EVVM-Signature-Constructor-Front
vercel --prod

# Deploy Koilen Dashboard
cd koilen-dashboard
vercel --prod
```

### Environment Configuration

```typescript
// Update contract addresses for mainnet
const KOILEN_ADDRESS = '0xYourMainnetAddress' as const

// Update RPC URLs
import { mainnet } from 'wagmi/chains'
```

### Build Optimization

```typescript
// next.config.ts
const nextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
}
```

---

## Resources

### Documentation
- [HACKATHON.md](HACKATHON.md) - Hackathon submission
- [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) - All deployments
- [KOILEN_README.md](KOILEN_README.md) - Technical documentation

### Contracts
- MATE: [0x8DD57a31a4b21FD0000351582e28E50600194f74](https://sepolia.etherscan.io/address/0x8DD57a31a4b21FD0000351582e28E50600194f74)
- Custom: [0x927e11039EbDE25095b3C413Ef35981119e3f257](https://sepolia.etherscan.io/address/0x927e11039EbDE25095b3C413Ef35981119e3f257)

### External Links
- [EVVM Documentation](https://evvm.gitbook.io/)
- [Wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Documentation](https://rainbowkit.com/)
- [Next.js Documentation](https://nextjs.org/docs)

---

## License

MIT License - See LICENSE file for details

---

## Contributors

Built by mexiweb3 for the MATE Metaprotocol Hackathon

---

**Last Updated**: November 23, 2024
**Status**: Production Ready ✅
