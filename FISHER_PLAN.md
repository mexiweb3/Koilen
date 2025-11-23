# Fisher Implementation Plan

## Objetivo
Implementar un Fisher simple que permita transacciones gasless para logSensorEvent()

## Tiempo Estimado: 1.5-2 horas

---

## ¿Qué es un Fisher?

Un Fisher en EVVM es un relayer que:
1. Recibe solicitudes de transacciones firmadas
2. Paga el gas en nombre del usuario
3. Envía la transacción al contrato

---

## Plan de Implementación

### Paso 1: Contrato Fisher (30 mins)

```solidity
// contracts/KoilenFisher.sol
contract KoilenFisher {
    KoilenService public koilenService;
    address public owner;

    constructor(address _koilenService) {
        koilenService = KoilenService(_koilenService);
        owner = msg.sender;
    }

    // Fisher relaya eventos firmados
    function relayEvent(
        string memory sensorUsername,
        int256 value,
        uint64 timestamp,
        KoilenService.EventType eventType,
        bytes32 batchHash,
        bytes memory signature
    ) external {
        // Verificar firma
        require(verifySignature(sensorUsername, value, timestamp, eventType, batchHash, signature), "Invalid signature");

        // Llamar a KoilenService (Fisher paga gas)
        koilenService.logSensorEvent(sensorUsername, value, timestamp, eventType, batchHash);
    }

    function verifySignature(...) internal pure returns (bool) {
        // EIP-712 signature verification
        // ...
    }
}
```

### Paso 2: Script de Deployment (15 mins)

```solidity
// script/DeployKoilenFisher.s.sol
contract DeployKoilenFisher is Script {
    function run() external {
        vm.startBroadcast();

        KoilenFisher fisher = new KoilenFisher(
            0x8DD57a31a4b21FD0000351582e28E50600194f74 // KoilenService MATE
        );

        vm.stopBroadcast();

        console.log("Fisher deployed at:", address(fisher));
    }
}
```

### Paso 3: Backend Relayer Service (45 mins)

```typescript
// scripts/fisher-relayer.ts
import { ethers } from 'ethers';

const FISHER_ADDRESS = '0x...';
const KOILEN_SERVICE = '0x8DD57a31a4b21FD0000351582e28E50600194f74';

// Express API
app.post('/api/relay-event', async (req, res) => {
    const { sensorUsername, value, timestamp, eventType, batchHash, signature } = req.body;

    // Validar signature
    const isValid = await verifySignature(signature);
    if (!isValid) {
        return res.status(400).json({ error: 'Invalid signature' });
    }

    // Enviar transacción via Fisher (backend paga gas)
    const fisher = new ethers.Contract(FISHER_ADDRESS, FISHER_ABI, backendWallet);
    const tx = await fisher.relayEvent(sensorUsername, value, timestamp, eventType, batchHash, signature);

    await tx.wait();

    res.json({ txHash: tx.hash });
});

app.listen(3000);
```

### Paso 4: Cliente IoT (Mock) (30 mins)

```typescript
// scripts/iot-client-gasless.ts
import { ethers } from 'ethers';

// Sensor firma localmente (no necesita ETH)
const sensorWallet = new ethers.Wallet(SENSOR_PRIVATE_KEY);

async function sendGaslessEvent(temperature: number, eventType: number) {
    const message = {
        sensorUsername: 'TestSensor1',
        value: temperature * 1e6,
        timestamp: Math.floor(Date.now() / 1000),
        eventType,
        batchHash: ethers.utils.randomBytes(32)
    };

    // Firmar mensaje (EIP-712)
    const signature = await sensorWallet._signTypedData(domain, types, message);

    // Enviar a Fisher API (HTTP, no blockchain)
    const response = await fetch('http://localhost:3000/api/relay-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...message, signature })
    });

    const { txHash } = await response.json();
    console.log('Event logged (gasless):', txHash);
}

// Sensor envía evento sin ETH
await sendGaslessEvent(-5, 1); // TEMP_HIGH
```

---

## Beneficios

1. **Gasless**: Sensores no necesitan ETH
2. **UX mejorada**: Solo firman mensajes
3. **Demuestra Fisher**: Califica mejor para premio MATE
4. **Escalable**: Múltiples sensores sin gestión de gas

---

## Riesgos

1. **Tiempo ajustado**: 1.5-2 horas es optimista
2. **Debugging**: Firmas EIP-712 pueden tener bugs
3. **Infraestructura**: Necesitas backend corriendo
4. **Testing**: Poco tiempo para validar

---

## Alternativa: Fisher "Simulado"

Si no hay tiempo para implementación completa:

### Paso 1: Contrato Fisher Simple (20 mins)
```solidity
contract KoilenFisherSimple {
    KoilenService public koilenService;

    // Fisher relay sin verificación de firma (solo demo)
    function relayEvent(
        string memory sensorUsername,
        int256 value,
        uint64 timestamp,
        uint8 eventType,
        bytes32 batchHash
    ) external {
        koilenService.logSensorEvent(sensorUsername, value, timestamp, KoilenService.EventType(eventType), batchHash);
    }
}
```

### Paso 2: Script de Demo (10 mins)
```bash
# Backend llama a Fisher (paga gas)
cast send $FISHER_ADDRESS \
  "relayEvent(string,int256,uint64,uint8,bytes32)" \
  "TestSensor" \
  -5000000 \
  $(date +%s) \
  1 \
  0x0000000000000000000000000000000000000000000000000000000000000001 \
  --account defaultKey \
  --rpc-url https://0xrpc.io/sep
```

### Paso 3: Documentación (10 mins)
Explicar en HACKATHON.md que es un Fisher básico para demostrar concepto.

**Tiempo total**: 40 mins
**Riesgo**: Bajo

---

## Opción C: Frontend Básico

### Con Scaffold-ETH 2 (2 horas)

**Demasiado arriesgado para 5 horas restantes**

Razones:
1. Setup inicial (30 mins)
2. Configurar wagmi/viem (30 mins)
3. Crear componentes (1 hora)
4. Testing y debugging (variable)
5. Deploy (20 mins)

**Alto riesgo de no terminar a tiempo**

---

## Mi Recomendación

### Plan Conservador (1 hora total):
1. **Fisher Simple** (40 mins) - Versión sin firmas
2. **Video Demo** (20 mins) - Mostrar deployment y Fisher
3. **Actualizar HACKATHON.md** (10 mins) - Agregar Fisher demo

### Ventajas:
- Bajo riesgo
- Agrega valor al proyecto
- Demuestra concepto gasless
- No compromete lo ya logrado

### Desventajas:
- No es Fisher completo con firmas EIP-712
- Frontend queda para después del hackathon

---

## ¿Qué te parece?

1. **Solo documentación y demo** (30 mins, riesgo 0)
2. **Fisher simple + demo** (1 hora, riesgo bajo)
3. **Fisher completo con firmas** (2 horas, riesgo medio)
4. **Todo (Fisher + Frontend)** (3.5 horas, riesgo ALTO)
