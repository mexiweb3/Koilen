# 🏗️ Guía Completa: Configuración de Clientes en Koilen

Esta guía te muestra cómo configurar un cliente nuevo con su jerarquía completa:

**Cliente → Sucursal → Sensor**

---

## 📋 Pre-requisitos

1. ✅ EVVM desplegado
2. ✅ NameService desplegado
3. ✅ KoilenService desplegado (ver sección de deployment)
4. ✅ Wallet con ETH en Sepolia
5. ✅ Foundry instalado

---

## 🚀 Paso 1: Desplegar KoilenService

### 1.1 Actualizar direcciones en el script

Edita [script/DeployKoilenService.s.sol](script/DeployKoilenService.s.sol):

```solidity
// Reemplaza BACKEND_ADDRESS con la wallet de tu backend Koilen
address constant BACKEND_ADDRESS = 0xTU_BACKEND_WALLET;
```

### 1.2 Compilar y desplegar

```bash
# Compilar
forge build

# Desplegar en Sepolia
forge script script/DeployKoilenService.s.sol:DeployKoilenService \
  --rpc-url $RPC_URL_ETH_SEPOLIA \
  --account defaultKey \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API \
  -vvvv
```

### 1.3 Guardar la dirección

El script mostrará:
```
KoilenService deployed at: 0x...
```

Guarda esta dirección, la necesitarás después.

---

## 🎯 Paso 2: Configurar un Cliente Nuevo

### Opción A: Script Interactivo (Recomendado)

```bash
tsx scripts/setup-koilen-client.ts
```

Este script te guía paso a paso y genera un archivo JSON con la configuración.

**Ejemplo de interacción:**

```
Nombre del cliente: RestaurantChain
Dirección del dueño: 0x69c13cbfFC6Fb9FF93F9371853Da50f737055b89
Email: contact@restaurant.com
Ubicación: Buenos Aires
Créditos iniciales: 10000

Nombre de la sucursal: RestaurantChain_Palermo
Ubicación de la sucursal: Palermo, Buenos Aires
Dirección del dueño: 0x69c13cbfFC6Fb9FF93F9371853Da50f737055b89

Nombre del sensor: RestaurantChain_Palermo_Fridge1
Modelo: DHT22
Serie: SN123456
Dirección del dueño: 0x69c13cbfFC6Fb9FF93F9371853Da50f737055b89
```

**Output:** Genera `koilen-client-restaurantchain.json`

---

### Opción B: Manual (Paso a paso)

## 📝 Jerarquía de Nombres

### Naming Convention Recomendada:

```
Cliente:   RestaurantChain
Sucursal:  RestaurantChain_Palermo
Sensor:    RestaurantChain_Palermo_Fridge1
```

**Reglas:**
- Mínimo 4 caracteres
- Empezar con letra
- Solo letras, números y guión bajo (`_`)
- Sin espacios ni caracteres especiales

---

## 🔐 Paso 3: Registrar Identidades en NameService

Cada entidad (Cliente, Sucursal, Sensor) debe seguir el proceso de 2 pasos del NameService.

### 3.1 Cliente

#### Pre-registro:

```bash
# 1. Generar número aleatorio
CLIENT_RANDOM=123456789

# 2. Calcular hash
CLIENT_HASH=$(cast keccak "$(cast abi-encode 'f(string,uint256)' 'RestaurantChain' $CLIENT_RANDOM)")

# 3. Pre-registrar (requiere firmas EIP-191 - próximamente automatizado)
# Por ahora: usar el wizard de EVVM o crear firmas manualmente
```

#### Registro Final (después de 30 minutos):

```bash
# Registrar con username y random number
# (Requiere firmas - próximamente automatizado)
```

#### Agregar Metadata:

```bash
# Después de registrar, agregar metadata usando addCustomMetadata:

# Tipo de entidad
type:>client

# Email de contacto
email:contact>contact@restaurant.com

# Ubicación
location:>Buenos Aires, Argentina

# Descripción
description:>Cadena de restaurantes
```

### 3.2 Sucursal

Mismo proceso, con metadata:

```bash
# Metadata de sucursal:
type:>branch
parent:>RestaurantChain
location:>Palermo, Buenos Aires
address:>Av. Santa Fe 1234
```

### 3.3 Sensor

Mismo proceso, con metadata:

```bash
# Metadata de sensor:
type:>sensor
parent:>RestaurantChain_Palermo
device:>DHT22
serial:>SN123456
location:>Cámara Fría Principal
```

---

## 🔗 Paso 4: Registrar en KoilenService

Una vez que las identidades estén en NameService, regístralas en KoilenService:

### 4.1 Registrar Cliente

```bash
cast send KOILEN_SERVICE_ADDRESS \
  "registerClient(string,uint256)" \
  "RestaurantChain" \
  10000000000000000000000 \
  --account defaultKey \
  --rpc-url $RPC_URL_ETH_SEPOLIA
```

(10000 KOIL = 10000 × 10^18 wei)

### 4.2 Registrar Sucursal

```bash
cast send KOILEN_SERVICE_ADDRESS \
  "registerBranch(string,string)" \
  "RestaurantChain_Palermo" \
  "RestaurantChain" \
  --account defaultKey \
  --rpc-url $RPC_URL_ETH_SEPOLIA
```

### 4.3 Registrar Sensor

```bash
cast send KOILEN_SERVICE_ADDRESS \
  "registerSensor(string,string,string)" \
  "RestaurantChain_Palermo_Fridge1" \
  "RestaurantChain_Palermo" \
  "RestaurantChain" \
  --account defaultKey \
  --rpc-url $RPC_URL_ETH_SEPOLIA
```

---

## ✅ Paso 5: Verificación

### 5.1 Verificar Cliente

```bash
# Ver créditos del cliente
cast call KOILEN_SERVICE_ADDRESS \
  "getClientCredits(string)" \
  "RestaurantChain" \
  --rpc-url $RPC_URL_ETH_SEPOLIA
```

### 5.2 Verificar Sensores del Cliente

```bash
# Ver todos los sensores de un cliente
cast call KOILEN_SERVICE_ADDRESS \
  "getClientSensors(string)" \
  "RestaurantChain" \
  --rpc-url $RPC_URL_ETH_SEPOLIA
```

### 5.3 Verificar Sensor

```bash
# Ver a qué cliente pertenece un sensor
cast call KOILEN_SERVICE_ADDRESS \
  "getSensorClient(string)" \
  "RestaurantChain_Palermo_Fridge1" \
  --rpc-url $RPC_URL_ETH_SEPOLIA
```

---

## 📊 Paso 6: Probar con un Evento

### 6.1 Loguear un evento desde el backend

```bash
cast send KOILEN_SERVICE_ADDRESS \
  "logSensorEvent(string,int256,uint64,uint8,bytes32)" \
  "RestaurantChain_Palermo_Fridge1" \
  -5000000 \
  $(date +%s) \
  1 \
  0x0000000000000000000000000000000000000000000000000000000000000001 \
  --account defaultKey \
  --rpc-url $RPC_URL_ETH_SEPOLIA
```

**Parámetros:**
- Sensor: `RestaurantChain_Palermo_Fridge1`
- Valor: `-5000000` (temperatura en micro-grados, ej: -5°C)
- Timestamp: Unix timestamp actual
- Tipo: `1` (TEMP_HIGH - temperatura alta)
- BatchHash: Hash del lote de lecturas

### 6.2 Ver eventos del sensor

```bash
cast call KOILEN_SERVICE_ADDRESS \
  "getSensorEvents(string)" \
  "RestaurantChain_Palermo_Fridge1" \
  --rpc-url $RPC_URL_ETH_SEPOLIA
```

---

## 💰 Gestión de Créditos

### Agregar créditos a un cliente

```bash
cast send KOILEN_SERVICE_ADDRESS \
  "topUpCredits(string,uint256)" \
  "RestaurantChain" \
  5000000000000000000000 \
  --account defaultKey \
  --rpc-url $RPC_URL_ETH_SEPOLIA
```

(5000 KOIL tokens)

### Ver balance de créditos

```bash
cast call KOILEN_SERVICE_ADDRESS \
  "getClientCredits(string)" \
  "RestaurantChain" \
  --rpc-url $RPC_URL_ETH_SEPOLIA
```

---

## 📈 Costos por Tipo de Evento

| Tipo de Evento | Costo (KOIL) |
|----------------|--------------|
| NORMAL         | 0            |
| TEMP_HIGH      | 1            |
| TEMP_LOW       | 1            |
| HUMIDITY_HIGH  | 1            |
| HUMIDITY_LOW   | 1            |
| DOOR_OPEN      | 2            |
| POWER_FAILURE  | 5            |
| SENSOR_ERROR   | 1            |

Puedes ajustar estos costos como admin:

```bash
cast send KOILEN_SERVICE_ADDRESS \
  "setEventCost(uint8,uint256)" \
  6 \
  10000000000000000000 \
  --account defaultKey \
  --rpc-url $RPC_URL_ETH_SEPOLIA
```

(Establece POWER_FAILURE en 10 KOIL)

---

## 🔄 Flujo Completo de Ejemplo

### Ejemplo: Cadena de Restaurantes con 3 Sucursales

```
Cliente: RestaurantChain

Sucursal 1: RestaurantChain_Palermo
  ├── Sensor: RestaurantChain_Palermo_Fridge1
  ├── Sensor: RestaurantChain_Palermo_Fridge2
  └── Sensor: RestaurantChain_Palermo_Freezer1

Sucursal 2: RestaurantChain_Recoleta
  ├── Sensor: RestaurantChain_Recoleta_Fridge1
  └── Sensor: RestaurantChain_Recoleta_Fridge2

Sucursal 3: RestaurantChain_Belgrano
  └── Sensor: RestaurantChain_Belgrano_Fridge1
```

**Pasos:**

1. Registrar `RestaurantChain` (cliente)
2. Registrar `RestaurantChain_Palermo`, `RestaurantChain_Recoleta`, `RestaurantChain_Belgrano` (sucursales)
3. Registrar los 6 sensores
4. Asignar 10,000 KOIL de créditos iniciales
5. Configurar backend para enviar eventos de los 6 sensores

---

## 🛠️ Funciones de Admin

### Desactivar un cliente

```bash
cast send KOILEN_SERVICE_ADDRESS \
  "deactivateClient(string)" \
  "RestaurantChain" \
  --account defaultKey \
  --rpc-url $RPC_URL_ETH_SEPOLIA
```

### Reactivar un cliente

```bash
cast send KOILEN_SERVICE_ADDRESS \
  "activateClient(string)" \
  "RestaurantChain" \
  --account defaultKey \
  --rpc-url $RPC_URL_ETH_SEPOLIA
```

### Cambiar dirección del backend

```bash
cast send KOILEN_SERVICE_ADDRESS \
  "setBackendAddress(address)" \
  0xNUEVA_DIRECCION_BACKEND \
  --account defaultKey \
  --rpc-url $RPC_URL_ETH_SEPOLIA
```

---

## 🔍 Troubleshooting

### "Identity does not exist"
- La identidad no está registrada en NameService
- Verifica con: `cast call NAME_SERVICE "verifyIfIdentityExists(string)" "username"`

### "Client not registered"
- El cliente no está registrado en KoilenService
- Verifica con: `cast call KOILEN_SERVICE "getClientCredits(string)" "ClientName"`

### "Insufficient credits"
- El cliente no tiene suficientes créditos KOIL
- Agrega créditos con `topUpCredits()`

### "Not authorized backend"
- La wallet que llama a `logSensorEvent` no es el backend autorizado
- Verifica con: `cast call KOILEN_SERVICE "koilenBackend()"`

---

## 📚 Recursos

- **KoilenService.sol:** [src/contracts/koilen/KoilenService.sol](src/contracts/koilen/KoilenService.sol)
- **Deployment Script:** [script/DeployKoilenService.s.sol](script/DeployKoilenService.s.sol)
- **Setup Script:** [scripts/setup-koilen-client.ts](scripts/setup-koilen-client.ts)
- **NameService Guide:** [NAMESERVICE_GUIDE.md](NAMESERVICE_GUIDE.md)

---

## 🎯 Resumen del Flujo

```
1. Desplegar KoilenService ✅
   ↓
2. Registrar Cliente en NameService (2 pasos) ✅
   ↓
3. Registrar Sucursal en NameService (2 pasos) ✅
   ↓
4. Registrar Sensor en NameService (2 pasos) ✅
   ↓
5. Agregar metadata a cada identidad ✅
   ↓
6. Registrar Cliente en KoilenService ✅
   ↓
7. Registrar Sucursal en KoilenService ✅
   ↓
8. Registrar Sensor en KoilenService ✅
   ↓
9. Backend empieza a enviar eventos ✅
   ↓
10. Dashboard consulta eventos on-chain ✅
```

---

¿Necesitas ayuda? Abre un issue o pregunta en el chat.
