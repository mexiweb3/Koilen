# Frontend Event Logging - Koilen Dashboard

## Objetivo
Dashboard para registrar eventos de temperatura/humedad y visualizar historial

## Tiempo Estimado: 1.5-2 horas

---

## Funcionalidades

### Página Principal: Event Logger

1. **Selector de Sensor**
   - Dropdown con sensores pre-registrados
   - Mostrar: Cliente, Sucursal, Créditos disponibles

2. **Formulario de Evento**
   - Input: Temperatura (°C)
   - Input: Humedad (%)
   - Auto-detect: Tipo de evento basado en valores
   - Display: Costo del evento (KOIL)
   - Botón: "Log Event"

3. **Timeline de Eventos**
   - Lista de últimos eventos del sensor seleccionado
   - Timestamp, temperatura, humedad, tipo, costo
   - Color-coded por severidad

4. **Stats Panel**
   - Créditos restantes
   - Eventos logged hoy
   - Alertas activas
   - Último evento

---

## UI Mockup

```
┌─────────────────────────────────────────────────┐
│  Koilen Dashboard        [Connect Wallet]       │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  Select Sensor                           │  │
│  │  ┌────────────────────────────────────┐  │  │
│  │  │ TestSensor1 (TestClient > Lab1)    │  │  │
│  │  └────────────────────────────────────┘  │  │
│  │  Credits: 9,999 KOIL                     │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────┐  ┌───────────────────┐   │
│  │  Log New Event   │  │  Recent Events    │   │
│  ├──────────────────┤  ├───────────────────┤   │
│  │ Temperature (°C) │  │ 🔴 -8°C  TEMP_LOW │   │
│  │ ┌──────────────┐ │  │    2 min ago      │   │
│  │ │    -5        │ │  │                   │   │
│  │ └──────────────┘ │  │ 🟡 2°C   NORMAL   │   │
│  │                  │  │    5 min ago      │   │
│  │ Humidity (%)     │  │                   │   │
│  │ ┌──────────────┐ │  │ 🔴 -10°C CRITICAL │   │
│  │ │    65        │ │  │    10 min ago     │   │
│  │ └──────────────┘ │  │                   │   │
│  │                  │  └───────────────────┘   │
│  │ Detected: TEMP_HIGH                         │
│  │ Cost: 1 KOIL                                │
│  │                                             │
│  │ [Log Event]                                 │
│  └──────────────────┘                          │
└─────────────────────────────────────────────────┘
```

---

## Implementación

### Paso 1: Setup Next.js (10 mins)

```bash
cd /d/Docs/Koilen
npx create-next-app@latest koilen-dashboard --typescript --tailwind --app
cd koilen-dashboard
npm install wagmi viem @rainbow-me/rainbowkit @tanstack/react-query
```

### Paso 2: Configuración wagmi (15 mins)

```typescript
// app/providers.tsx
'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const config = getDefaultConfig({
  appName: 'Koilen Dashboard',
  projectId: 'YOUR_WALLET_CONNECT_ID', // Free en cloud.walletconnect.com
  chains: [sepolia],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### Paso 3: Página Principal (45 mins)

```typescript
// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';

const KOILEN_ADDRESS = '0x8DD57a31a4b21FD0000351582e28E50600194f74';

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
] as const;

// Tipos de eventos
const EVENT_TYPES = {
  NORMAL: 0,
  TEMP_HIGH: 1,
  TEMP_LOW: 2,
  HUMIDITY_HIGH: 3,
  HUMIDITY_LOW: 4,
  DOOR_OPEN: 5,
  POWER_FAILURE: 6,
  SENSOR_ERROR: 7
};

const EVENT_COSTS = {
  0: '0',
  1: '1',
  2: '1',
  3: '1',
  4: '1',
  5: '2',
  6: '5',
  7: '1'
};

export default function Home() {
  // Estados
  const [sensorName, setSensorName] = useState('KoilenTest_Lab_Sensor1');
  const [clientName, setClientName] = useState('KoilenTest');
  const [temperature, setTemperature] = useState(-5);
  const [humidity, setHumidity] = useState(65);
  const [events, setEvents] = useState<any[]>([]);

  // Detectar tipo de evento automáticamente
  const detectEventType = () => {
    if (temperature > 10) return EVENT_TYPES.TEMP_HIGH;
    if (temperature < -10) return EVENT_TYPES.TEMP_LOW;
    if (humidity > 80) return EVENT_TYPES.HUMIDITY_HIGH;
    if (humidity < 30) return EVENT_TYPES.HUMIDITY_LOW;
    return EVENT_TYPES.NORMAL;
  };

  const eventType = detectEventType();
  const eventCost = EVENT_COSTS[eventType as keyof typeof EVENT_COSTS];

  // Leer créditos del cliente
  const { data: credits } = useReadContract({
    address: KOILEN_ADDRESS,
    abi: KOILEN_ABI,
    functionName: 'getClientCredits',
    args: [clientName],
  });

  // Log event
  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Agregar evento a timeline cuando se confirma
  useEffect(() => {
    if (isSuccess) {
      const newEvent = {
        temperature,
        humidity,
        eventType,
        timestamp: new Date(),
        txHash: hash
      };
      setEvents([newEvent, ...events].slice(0, 10)); // Mantener últimos 10
    }
  }, [isSuccess]);

  const handleLogEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const tempValue = Math.floor(temperature * 1e6); // Convertir a micro-unidades
    const timestamp = Math.floor(Date.now() / 1000);
    const batchHash = '0x0000000000000000000000000000000000000000000000000000000000000001';

    writeContract({
      address: KOILEN_ADDRESS,
      abi: KOILEN_ABI,
      functionName: 'logSensorEvent',
      args: [sensorName, tempValue, timestamp, eventType, batchHash],
    });
  };

  const getEventTypeName = (type: number) => {
    const names = ['NORMAL', 'TEMP_HIGH', 'TEMP_LOW', 'HUMIDITY_HIGH', 'HUMIDITY_LOW', 'DOOR_OPEN', 'POWER_FAILURE', 'SENSOR_ERROR'];
    return names[type] || 'UNKNOWN';
  };

  const getEventColor = (type: number) => {
    if (type === 0) return 'text-green-600';
    if (type === 6) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getEventIcon = (type: number) => {
    if (type === 0) return '🟢';
    if (type === 6) return '🔴';
    return '🟡';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Koilen Dashboard
              </h1>
            </div>
            <div className="flex items-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Log Event */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Log Sensor Event</h2>

              {/* Sensor Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <div className="text-sm text-gray-600">Selected Sensor</div>
                <div className="font-semibold">{sensorName}</div>
                <div className="text-sm text-gray-500">Client: {clientName}</div>
                <div className="text-sm font-medium text-indigo-600">
                  Credits: {credits ? formatEther(credits) : '0'} KOIL
                </div>
              </div>

              {/* Event Form */}
              <form onSubmit={handleLogEvent} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temperature (°C)
                    </label>
                    <input
                      type="number"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Humidity (%)
                    </label>
                    <input
                      type="number"
                      value={humidity}
                      onChange={(e) => setHumidity(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                {/* Event Type Detection */}
                <div className="p-4 bg-blue-50 rounded-md">
                  <div className="text-sm text-gray-600">Detected Event Type</div>
                  <div className={`font-bold ${getEventColor(eventType)}`}>
                    {getEventTypeName(eventType)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Cost: {eventCost} KOIL
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending || isConfirming}
                  className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending || isConfirming ? 'Logging Event...' : 'Log Event'}
                </button>
              </form>

              {isSuccess && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="text-green-800 font-medium">Event Logged Successfully!</div>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 underline"
                  >
                    View on Etherscan
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Event Timeline */}
          <div>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Recent Events</h2>

              {events.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No events logged yet
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((event, idx) => (
                    <div
                      key={idx}
                      className="p-3 border border-gray-200 rounded-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{getEventIcon(event.eventType)}</span>
                          <div>
                            <div className={`font-semibold ${getEventColor(event.eventType)}`}>
                              {getEventTypeName(event.eventType)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {event.temperature}°C, {event.humidity}%
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {event.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h3 className="font-bold mb-3">Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Events Today</span>
                  <span className="font-semibold">{events.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Credits Remaining</span>
                  <span className="font-semibold">
                    {credits ? formatEther(credits) : '0'} KOIL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
```

### Paso 4: Deploy a Vercel (15 mins)

```bash
# En la carpeta koilen-dashboard
vercel

# Seguir prompts
# URL resultante: https://koilen-dashboard.vercel.app
```

---

## Features del Dashboard

### ✅ Auto-Detection de Eventos
- Temp > 10°C → TEMP_HIGH
- Temp < -10°C → TEMP_LOW
- Humidity > 80% → HUMIDITY_HIGH
- Humidity < 30% → HUMIDITY_LOW
- Caso contrario → NORMAL

### ✅ Timeline en Tiempo Real
- Últimos 10 eventos
- Color-coded por severidad
- Timestamp
- Link a Etherscan

### ✅ Stats Panel
- Créditos restantes
- Eventos del día
- Fácil de expandir

### ✅ UX Fluida
- Connect wallet con RainbowKit
- Loading states
- Success notifications
- Error handling

---

## Demo Script (2 minutos)

1. **Conectar Wallet** (5 seg)
2. **Mostrar sensor seleccionado** (5 seg)
3. **Cambiar temperatura a -15°C** (5 seg)
   - Muestra: "Detected: TEMP_LOW, Cost: 1 KOIL"
4. **Click "Log Event"** (10 seg)
   - Wallet confirm
   - Transacción en progreso
5. **Success!** (5 seg)
   - Evento aparece en timeline
   - Link a Etherscan
   - Créditos actualizados
6. **Repetir con otro valor** (30 seg)
   - Temp: 15°C → TEMP_HIGH
   - Mostrar timeline creciendo
7. **Zoom out** (10 seg)
   - Mostrar dashboard completo
   - Stats panel
   - UX limpia

---

## Por qué es MEJOR que Frontend de Setup

| Feature | Setup Frontend | Event Logging Frontend |
|---------|---------------|----------------------|
| Demuestra valor | ❌ Solo admin | ✅ Core feature |
| Visual impact | ⚠️ Formularios | ✅ Dashboard + Timeline |
| Story | ❌ "Registro" | ✅ "Sensor en acción" |
| Diferenciación | ❌ Básico | ✅ Único |
| Demo time | 30 seg | 2 min (engaging) |

---

## Timeline de Implementación

| Paso | Tiempo | Acumulado |
|------|--------|-----------|
| Setup Next.js | 10 min | 10 min |
| Config wagmi | 15 min | 25 min |
| Layout + Header | 10 min | 35 min |
| Event Form | 20 min | 55 min |
| Timeline Component | 15 min | 1h 10min |
| Stats Panel | 10 min | 1h 20min |
| Polish UI | 15 min | 1h 35min |
| Deploy Vercel | 15 min | 1h 50min |

**Total: ~2 horas**

---

## ¿Procedo?

Este frontend es MUCHO más impactante porque:
1. Demuestra la funcionalidad REAL del sistema
2. Es visualmente atractivo
3. Cuenta una historia completa
4. Los jueces pueden interactuar

¿Empiezo con el setup del proyecto?
