'use client'
import { useState } from 'react'
import { useWriteContract, useAccount } from 'wagmi'

interface SensorEventComponentProps {
  evvmAddress: string
}

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
] as const

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
  0: '0',
  1: '1',
  2: '1',
  3: '1',
  4: '1',
  5: '2',
  6: '5',
  7: '1'
}

const boxStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1.5rem',
  border: '1px solid #e0e0e0',
  borderRadius: '12px',
  backgroundColor: '#f9fafb',
  width: '100%',
} as const

const inputStyle = {
  padding: '0.75rem',
  border: '1px solid #ccc',
  borderRadius: '8px',
  fontSize: '1rem',
  width: '100%',
} as const

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#4f46e5',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: '600',
  transition: 'all 0.2s',
} as const

const labelStyle = {
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '0.25rem',
} as const

export const SensorEventComponent = ({ evvmAddress }: SensorEventComponentProps) => {
  const { address } = useAccount()
  const { writeContract, isPending, isSuccess, error } = useWriteContract()

  const [koilenServiceAddress, setKoilenServiceAddress] = useState('')
  const [sensorName, setSensorName] = useState('KoilenTest_Lab_Sensor1')
  const [temperature, setTemperature] = useState(-5)
  const [humidity, setHumidity] = useState(65)

  const detectEventType = () => {
    if (temperature > 10) return EVENT_TYPES.TEMP_HIGH
    if (temperature < -10) return EVENT_TYPES.TEMP_LOW
    if (humidity > 80) return EVENT_TYPES.HUMIDITY_HIGH
    if (humidity < 30) return EVENT_TYPES.HUMIDITY_LOW
    return EVENT_TYPES.NORMAL
  }

  const getEventTypeName = (type: number) => {
    const names = ['NORMAL', 'TEMP_HIGH', 'TEMP_LOW', 'HUMIDITY_HIGH', 'HUMIDITY_LOW', 'DOOR_OPEN', 'POWER_FAILURE', 'SENSOR_ERROR']
    return names[type] || 'UNKNOWN'
  }

  const getEventColor = (type: number) => {
    if (type === 0) return '#10b981' // green
    if (type === 6) return '#ef4444' // red
    return '#f59e0b' // yellow
  }

  const eventType = detectEventType()
  const eventCost = EVENT_COSTS[eventType]

  const handleLogEvent = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!address) {
      alert('Please connect your wallet first')
      return
    }

    try {
      const tempValue = BigInt(Math.floor(temperature * 1e6))
      const timestamp = BigInt(Math.floor(Date.now() / 1000))
      const batchHash = '0x0000000000000000000000000000000000000000000000000000000000000001' as `0x${string}`

      const contractAddress = koilenServiceAddress || evvmAddress
      if (!contractAddress) {
        alert('Please enter a KoilenService contract address')
        return
      }

      await writeContract({
        address: contractAddress as `0x${string}`,
        abi: KOILEN_ABI,
        functionName: 'logSensorEvent',
        args: [sensorName, tempValue, timestamp, eventType, batchHash],
      })
    } catch (err: any) {
      console.error('Error logging event:', err)
      alert(`Error: ${err.message || 'Failed to log event'}`)
    }
  }

  return (
    <div style={boxStyle}>
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
          Koilen IoT Sensor Event Logger
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          Log temperature and humidity events to the MATE Metaprotocol
        </p>
      </div>

      {/* KoilenService Contract Address Input */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>KoilenService Contract Address</label>
        <input
          type="text"
          placeholder="0x8DD57a31a4b21FD0000351582e28E50600194f74 (MATE) or 0x927e11039EbDE25095b3C413Ef35981119e3f257 (Custom)"
          value={koilenServiceAddress}
          onChange={(e) => setKoilenServiceAddress(e.target.value)}
          style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.875rem' }}
        />
        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
          Enter the KoilenService contract address (different from EVVM address)
        </div>
      </div>

      {/* Sensor Info */}
      <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Selected Sensor</div>
        <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{sensorName}</div>
        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Client: KoilenTest</div>
      </div>

      {/* Event Form */}
      <form onSubmit={handleLogEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Temperature (°C)</label>
            <input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              style={inputStyle}
              step="0.1"
            />
          </div>

          <div>
            <label style={labelStyle}>Humidity (%)</label>
            <input
              type="number"
              value={humidity}
              onChange={(e) => setHumidity(Number(e.target.value))}
              style={inputStyle}
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* Event Type Detection */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#dbeafe',
          borderRadius: '8px',
          borderLeft: `4px solid ${getEventColor(eventType)}`
        }}>
          <div style={{ fontSize: '0.75rem', color: '#1e3a8a', marginBottom: '0.25rem' }}>
            Detected Event Type
          </div>
          <div style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: getEventColor(eventType),
            marginBottom: '0.25rem'
          }}>
            {getEventTypeName(eventType)}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#1e3a8a' }}>
            Cost: {eventCost} KOIL
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending || !address}
          style={{
            ...buttonStyle,
            opacity: isPending || !address ? 0.5 : 1,
            cursor: isPending || !address ? 'not-allowed' : 'pointer',
          }}
        >
          {isPending ? 'Logging Event...' : address ? 'Log Event' : 'Connect Wallet First'}
        </button>
      </form>

      {/* Status Messages */}
      {isSuccess && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#d1fae5',
          border: '1px solid #10b981',
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          <div style={{ color: '#065f46', fontWeight: '600', marginBottom: '0.25rem' }}>
            ✓ Event Logged Successfully!
          </div>
          <div style={{ fontSize: '0.875rem', color: '#047857' }}>
            Your sensor event has been recorded on the MATE Metaprotocol
          </div>
        </div>
      )}

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          <div style={{ color: '#991b1b', fontWeight: '600', marginBottom: '0.25rem' }}>
            ✗ Error
          </div>
          <div style={{ fontSize: '0.875rem', color: '#b91c1c' }}>
            {error.message}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#fff7ed',
        border: '1px solid #fb923c',
        borderRadius: '8px',
        marginTop: '1rem'
      }}>
        <div style={{ fontSize: '0.875rem', color: '#9a3412', lineHeight: '1.5' }}>
          <strong>Event Thresholds:</strong><br />
          • TEMP_HIGH: &gt; 10°C (1 KOIL)<br />
          • TEMP_LOW: &lt; -10°C (1 KOIL)<br />
          • HUMIDITY_HIGH: &gt; 80% (1 KOIL)<br />
          • HUMIDITY_LOW: &lt; 30% (1 KOIL)<br />
          • NORMAL: Otherwise (0 KOIL)
        </div>
      </div>
    </div>
  )
}
