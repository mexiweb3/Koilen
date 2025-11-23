# 📖 Guía de Registro de Usuarios - EVVM Name Service

Tu NameService está desplegado en: `0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3`

## 🎯 Proceso de Registro (2 pasos)

El registro de usuarios usa un sistema de 2 pasos para prevenir front-running:

### **Paso 1: Pre-registro** (Reserva el username)
### **Paso 2: Registro Final** (Completa el registro después de 30 minutos)

---

## 📋 Requisitos

- Wallet con ETH en Sepolia testnet
- Tokens KOIL (Principal Token) para pagar el registro
- Foundry (cast) instalado

---

## 🔍 Verificar Disponibilidad

Antes de registrar, verifica que el username esté disponible:

```bash
cast call 0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3 \
  "isUsernameAvailable(string)" "tunombre" \
  --rpc-url $RPC_URL_ETH_SEPOLIA
```

**Resultado:**
- `0x0000000000000000000000000000000000000000000000000000000000000001` = Disponible ✅
- `0x0000000000000000000000000000000000000000000000000000000000000000` = No disponible ❌

---

## 💰 Ver Precio de Registro

```bash
cast call 0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3 \
  "getPriceOfRegistration(string)" "tunombre" \
  --rpc-url $RPC_URL_ETH_SEPOLIA
```

El precio es dinámico: **100x el reward amount** del EVVM (o más si hay ofertas activas).

---

## 🚀 Registro Simplificado (Solo para Admin)

Como eres el admin del contrato, puedes registrar usernames directamente sin pre-registro:

### Método Directo (Admin Only)

```bash
# 1. Primero necesitas aprobar los tokens KOIL al NameService
# 2. Luego llamar a registrationUsername con firmas apropiadas
```

**Nota:** Este proceso requiere firmas criptográficas. Para simplificar, te recomiendo usar el SDK o crear un script.

---

## 📝 Registro Normal (2 Pasos)

### **Paso 1: Pre-registro**

1. **Genera un número aleatorio:**
   ```bash
   RANDOM_NUMBER=123456789
   ```

2. **Calcula el hash del username:**
   ```bash
   cast keccak "$(cast abi-encode 'f(string,uint256)' 'tunombre' $RANDOM_NUMBER)"
   ```

3. **Guarda el hash** (ejemplo: `0xabc...def`)

4. **Llama a preRegistrationUsername:**
   ```bash
   # Requiere firmas - ver sección de Scripts
   ```

### **Paso 2: Registro Final** (Después de 30 minutos)

1. **Espera 30 minutos**
2. **Llama a registrationUsername** con:
   - Tu username
   - El random number del paso 1
   - Firmas apropiadas

---

## 🛠️ Scripts Recomendados

### Opción 1: Script TypeScript Interactivo

```bash
tsx scripts/register-username.ts
```

### Opción 2: Crear Script Personalizado

Crea un script que:
1. Genere las firmas necesarias usando EIP-191
2. Maneje los nonces correctamente
3. Interactúe con el EVVM para los pagos

---

## 📊 Funciones Útiles

### Ver información de un username

```bash
# Ver dueño y fecha de expiración
cast call 0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3 \
  "getIdentityBasicMetadata(string)" "username" \
  --rpc-url $RPC_URL_ETH_SEPOLIA

# Ver metadata personalizada
cast call 0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3 \
  "getFullCustomMetadataOfIdentity(string)" "username" \
  --rpc-url $RPC_URL_ETH_SEPOLIA
```

---

## 🔐 Reglas de Usernames

- **Mínimo 4 caracteres**
- **Debe empezar con una letra**
- **Solo letras y números** (a-z, A-Z, 0-9)
- **Sin espacios ni caracteres especiales**

Ejemplos válidos: `alice`, `bob123`, `Charlie2024`
Ejemplos inválidos: `abc`, `123user`, `user-name`, `user name`

---

## 💡 Metadata Personalizada

Después de registrar, puedes agregar metadata siguiendo el formato:

```
[schema]:[subschema]>[valor]
```

Ejemplos:
- `email:contact>user@example.com`
- `socialMedia:twitter>@username`
- `memberOf:>EVVM`

**Costo:** 10x el reward amount por entrada de metadata

---

## 🎯 Ejemplo Completo (Simplificado)

```bash
# 1. Verificar disponibilidad
cast call 0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3 \
  "isUsernameAvailable(string)" "alice" \
  --rpc-url $RPC_URL_ETH_SEPOLIA

# 2. Ver precio
cast call 0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3 \
  "getPriceOfRegistration(string)" "alice" \
  --rpc-url $RPC_URL_ETH_SEPOLIA

# 3. Registrar (requiere script con firmas)
tsx scripts/register-username.ts
```

---

## 📚 Recursos

- **Documentación EVVM:** https://www.evvm.info/docs
- **NameService en Etherscan:** https://sepolia.etherscan.io/address/0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3
- **EVVM en Etherscan:** https://sepolia.etherscan.io/address/0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5

---

## ⚠️ Notas Importantes

1. **Firmas criptográficas:** El sistema requiere firmas EIP-191 para seguridad
2. **Nonces:** Cada operación requiere un nonce único para prevenir replay attacks
3. **Pagos:** Los registros requieren tokens KOIL (Principal Token)
4. **Tiempo de espera:** Pre-registros expiran en 30 minutos
5. **Renovaciones:** Los usernames duran 366 días y deben renovarse

---

## 🆘 Solución de Problemas

### "Username already registered"
- El username ya está tomado
- Espera 60 días después de que expire si quieres reclamarlo

### "PreRegistrationNotValid"
- No completaste el pre-registro
- El pre-registro expiró (pasan más de 30 minutos)
- El hash no coincide con el username/random number

### "InvalidSignature"
- La firma criptográfica no es válida
- Verifica que estés usando el EVVM ID correcto: **1074**

---

¿Necesitas ayuda? Pregúntame y te ayudo a crear el script específico que necesites.
