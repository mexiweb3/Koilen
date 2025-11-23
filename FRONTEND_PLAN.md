# Frontend Plan - Koilen Dashboard

## Objetivo
Dashboard simple para registrar clientes, sucursales y sensores manualmente

## Tiempo Estimado: 1.5-2 horas

---

## Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **Web3**: wagmi + viem
- **Wallet**: RainbowKit
- **Contract Interaction**: viem

---

## Funcionalidades MVP

### Página 1: Registrar Cliente
- Input: Nombre del cliente
- Input: Créditos iniciales (KOIL)
- Botón: "Registrar Cliente"
- Display: Transacción en progreso / éxito

### Página 2: Registrar Sucursal
- Dropdown: Seleccionar cliente existente
- Input: Nombre de sucursal
- Botón: "Registrar Sucursal"

### Página 3: Registrar Sensor
- Dropdown: Seleccionar cliente
- Dropdown: Seleccionar sucursal (filtrado por cliente)
- Input: Nombre de sensor
- Input: Modelo de sensor
- Botón: "Registrar Sensor"

### Página 4: Ver Sensores
- Lista de todos los sensores
- Información: Cliente, Sucursal, Estado
- Créditos restantes del cliente

---

## Implementación Paso a Paso

### Paso 1: Setup Next.js (10 mins)

```bash
# Crear proyecto Next.js
npx create-next-app@latest koilen-dashboard --typescript --tailwind --app

cd koilen-dashboard

# Instalar dependencias Web3
npm install wagmi viem @rainbow-me/rainbowkit
```

### Paso 2: Configurar wagmi (15 mins)

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
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
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

### Paso 3: Layout Principal (10 mins)

```typescript
// app/layout.tsx
import { Providers } from './providers';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-gray-50">
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
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
```

### Paso 4: Página Principal - Registrar Cliente (20 mins)

```typescript
// app/page.tsx
'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

const KOILEN_SERVICE_ADDRESS = '0x8DD57a31a4b21FD0000351582e28E50600194f74';
const KOILEN_ABI = [
  {
    name: 'registerClient',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'clientUsername', type: 'string' },
      { name: 'initialCredits', type: 'uint256' }
    ],
    outputs: []
  }
] as const;

export default function Home() {
  const [clientName, setClientName] = useState('');
  const [credits, setCredits] = useState('10000');

  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    writeContract({
      address: KOILEN_SERVICE_ADDRESS,
      abi: KOILEN_ABI,
      functionName: 'registerClient',
      args: [clientName, parseEther(credits)],
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Register Client</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Client Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="MyCompany"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Initial Credits (KOIL)
            </label>
            <input
              type="number"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="10000"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending || isConfirming}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isPending || isConfirming ? 'Registering...' : 'Register Client'}
          </button>
        </form>

        {isSuccess && (
          <div className="mt-4 p-4 bg-green-50 rounded-md">
            <p className="text-sm text-green-800">
              Client registered successfully!
              <a
                href={`https://sepolia.etherscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 underline"
              >
                View transaction
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Paso 5: Página Registrar Sucursal (20 mins)

```typescript
// app/register-branch/page.tsx
'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

const KOILEN_ABI = [
  {
    name: 'registerBranch',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'branchUsername', type: 'string' },
      { name: 'clientUsername', type: 'string' }
    ],
    outputs: []
  }
] as const;

export default function RegisterBranch() {
  const [branchName, setBranchName] = useState('');
  const [clientName, setClientName] = useState('');

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    writeContract({
      address: '0x8DD57a31a4b21FD0000351582e28E50600194f74',
      abi: KOILEN_ABI,
      functionName: 'registerBranch',
      args: [branchName, clientName],
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Register Branch</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Client Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="MyCompany"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Branch Name
            </label>
            <input
              type="text"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="MyCompany_Lab1"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending || isConfirming}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending || isConfirming ? 'Registering...' : 'Register Branch'}
          </button>
        </form>

        {isSuccess && (
          <div className="mt-4 p-4 bg-green-50 rounded-md">
            <p className="text-sm text-green-800">
              Branch registered successfully!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Paso 6: Página Registrar Sensor (20 mins)

```typescript
// app/register-sensor/page.tsx
'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

const KOILEN_ABI = [
  {
    name: 'registerSensor',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'sensorUsername', type: 'string' },
      { name: 'branchUsername', type: 'string' },
      { name: 'clientUsername', type: 'string' }
    ],
    outputs: []
  }
] as const;

export default function RegisterSensor() {
  const [sensorName, setSensorName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [clientName, setClientName] = useState('');

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    writeContract({
      address: '0x8DD57a31a4b21FD0000351582e28E50600194f74',
      abi: KOILEN_ABI,
      functionName: 'registerSensor',
      args: [sensorName, branchName, clientName],
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Register Sensor</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Client Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Branch Name
            </label>
            <input
              type="text"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sensor Name
            </label>
            <input
              type="text"
              value={sensorName}
              onChange={(e) => setSensorName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="MyCompany_Lab1_Sensor1"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending || isConfirming}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending || isConfirming ? 'Registering...' : 'Register Sensor'}
          </button>
        </form>

        {isSuccess && (
          <div className="mt-4 p-4 bg-green-50 rounded-md">
            <p className="text-sm text-green-800">
              Sensor registered successfully!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Paso 7: Navegación (10 mins)

```typescript
// components/Navigation.tsx
import Link from 'next/link';

export function Navigation() {
  return (
    <div className="bg-white shadow-sm mb-6">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          <Link href="/" className="py-4 px-3 border-b-2 border-transparent hover:border-indigo-500">
            Register Client
          </Link>
          <Link href="/register-branch" className="py-4 px-3 border-b-2 border-transparent hover:border-indigo-500">
            Register Branch
          </Link>
          <Link href="/register-sensor" className="py-4 px-3 border-b-2 border-transparent hover:border-indigo-500">
            Register Sensor
          </Link>
        </div>
      </nav>
    </div>
  );
}
```

### Paso 8: Deploy a Vercel (15 mins)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Seguir prompts
# - Link to existing project? No
# - Project name: koilen-dashboard
# - Deploy

# URL: https://koilen-dashboard.vercel.app
```

---

## Versión ULTRA RÁPIDA (1 hora)

Si el tiempo apremia, usa esta versión simplificada:

### Single Page App (30 mins)

```typescript
// app/page.tsx
'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWriteContract } from 'wagmi';
import { parseEther } from 'viem';

export default function Home() {
  const [tab, setTab] = useState<'client' | 'branch' | 'sensor'>('client');
  const { writeContract } = useWriteContract();

  const handleRegisterClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    writeContract({
      address: '0x8DD57a31a4b21FD0000351582e28E50600194f74',
      abi: [...],
      functionName: 'registerClient',
      args: [
        formData.get('name') as string,
        parseEther(formData.get('credits') as string)
      ],
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Koilen Dashboard</h1>
          <ConnectButton />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b">
            <button onClick={() => setTab('client')} className={...}>
              Register Client
            </button>
            <button onClick={() => setTab('branch')} className={...}>
              Register Branch
            </button>
            <button onClick={() => setTab('sensor')} className={...}>
              Register Sensor
            </button>
          </div>

          {/* Forms */}
          {tab === 'client' && <ClientForm onSubmit={handleRegisterClient} />}
          {tab === 'branch' && <BranchForm />}
          {tab === 'sensor' && <SensorForm />}
        </div>
      </div>
    </div>
  );
}
```

---

## Beneficios para Hackathon

1. **Demo Visual** - Los jueces ven la UI
2. **Fácil de Mostrar** - Video de 2 minutos
3. **UX Real** - No solo smart contracts
4. **Deploy en Vercel** - URL pública para compartir
5. **Diferenciación** - Pocos proyectos tienen frontend

---

## Timeline

| Tarea | Tiempo | Acumulado |
|-------|--------|-----------|
| Setup Next.js | 10 min | 10 min |
| Configurar wagmi | 15 min | 25 min |
| Layout principal | 10 min | 35 min |
| Página Register Client | 20 min | 55 min |
| Página Register Branch | 20 min | 1h 15min |
| Página Register Sensor | 20 min | 1h 35min |
| Navegación | 10 min | 1h 45min |
| Deploy Vercel | 15 min | 2h |

**Total: 2 horas**

---

## ¿Procedo con la implementación?

Puedo empezar con el setup y la primera página (Register Client) en los próximos 30 minutos.
