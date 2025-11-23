'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { formatEther } from 'viem';

const KOILEN_ADDRESS = '0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642' as const;

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

const EVENT_COSTS: Record<number, string> = {
  0: '0',
  1: '1',
  2: '1',
  3: '1',
  4: '1',
  5: '2',
  6: '5',
  7: '1'
};

interface SensorEvent {
  temperature: number;
  humidity: number;
  eventType: number;
  timestamp: Date;
  txHash: string;
}

export default function Home() {
  const [sensorName, setSensorName] = useState('KoilenTest_Lab_Sensor1');
  const [clientName, setClientName] = useState('KoilenTest');
  const [temperature, setTemperature] = useState(-5);
  const [humidity, setHumidity] = useState(65);
  const [events, setEvents] = useState<SensorEvent[]>([]);

  const detectEventType = () => {
    if (temperature > 10) return EVENT_TYPES.TEMP_HIGH;
    if (temperature < -10) return EVENT_TYPES.TEMP_LOW;
    if (humidity > 80) return EVENT_TYPES.HUMIDITY_HIGH;
    if (humidity < 30) return EVENT_TYPES.HUMIDITY_LOW;
    return EVENT_TYPES.NORMAL;
  };

  const eventType = detectEventType();
  const eventCost = EVENT_COSTS[eventType];

  const { data: credits } = useReadContract({
    address: KOILEN_ADDRESS,
    abi: KOILEN_ABI,
    functionName: 'getClientCredits',
    args: [clientName],
  });

  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess && hash) {
      const newEvent: SensorEvent = {
        temperature,
        humidity,
        eventType,
        timestamp: new Date(),
        txHash: hash
      };
      setEvents([newEvent, ...events].slice(0, 10));
    }
  }, [isSuccess]);

  const handleLogEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const tempValue = BigInt(Math.floor(temperature * 1e6));
    const timestamp = BigInt(Math.floor(Date.now() / 1000));
    const batchHash = '0x0000000000000000000000000000000000000000000000000000000000000001' as `0x${string}`;

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
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Koilen Dashboard
              </h1>
              <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                Test Contract (No NameService)
              </span>
            </div>
            <div className="flex items-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Log Sensor Event</h2>

              <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <div className="text-sm text-gray-600">Selected Sensor</div>
                <div className="font-semibold">{sensorName}</div>
                <div className="text-sm text-gray-500">Client: {clientName}</div>
                <div className="text-sm font-medium text-indigo-600">
                  Credits: {credits ? formatEther(credits) : '0'} KOIL
                </div>
              </div>

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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

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
                  className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

          <div>
            <div className="bg-white shadow rounded-lg p-6 mb-6">
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
                      className="p-3 border border-gray-200 rounded-md hover:border-indigo-300 transition-colors"
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

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="font-bold mb-3">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Events Logged</span>
                  <span className="font-semibold">{events.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Credits Remaining</span>
                  <span className="font-semibold text-indigo-600">
                    {credits ? formatEther(credits) : '0'} KOIL
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <a
                    href={`https://sepolia.etherscan.io/address/${KOILEN_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                  >
                    View Contract on Etherscan
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
