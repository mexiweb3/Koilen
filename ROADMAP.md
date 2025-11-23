# Koilen Development Roadmap

## 🎯 Próximos Pasos

### Fase 1: NameService Integration ✅ (Completado Parcialmente)

#### 1.1 Automatización de Firmas EIP-191
**Estado**: 🟡 Pendiente
**Prioridad**: Alta
**Descripción**: Crear script TypeScript/JavaScript para automatizar el proceso completo de registro en NameService

**Tareas**:
- [ ] Script para generar firmas EIP-191 automáticamente
- [ ] Función para calcular hash con EVVM ID (1074)
- [ ] Manejo de nonces únicos por usuario
- [ ] Proceso de 2 pasos automatizado:
  - Pre-registro (con hash)
  - Registro final (después de 30 minutos)
- [ ] Agregar metadata automáticamente después del registro
- [ ] Validación de disponibilidad de username
- [ ] Manejo de errores y retry logic

**Archivos a crear**:
- `scripts/nameservice-register.ts` - Script principal de registro
- `scripts/nameservice-utils.ts` - Utilidades para firmas EIP-191
- `test/nameservice-integration.test.ts` - Tests de integración

**Referencias**:
- NameService: [0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3](https://sepolia.etherscan.io/address/0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3)
- EVVM ID: 1074
- Documentación: [NAMESERVICE_GUIDE.md](NAMESERVICE_GUIDE.md)

#### 1.2 Integración con KoilenService Producción
**Estado**: ✅ Completado
**Descripción**: Contrato de producción desplegado con validación de NameService

**Contrato**: [0x927e11039EbDE25095b3C413Ef35981119e3f257](https://sepolia.etherscan.io/address/0x927e11039EbDE25095b3C413Ef35981119e3f257)

**Pendiente**:
- [ ] Probar registro completo con NameService
- [ ] Documentar proceso end-to-end
- [ ] Crear video tutorial

---

### Fase 2: Frontend Development 🟡 (En Planificación)

#### 2.1 Dashboard de Administración
**Estado**: 🔴 No iniciado
**Prioridad**: Alta
**Descripción**: Dashboard web para administrar sensores y visualizar eventos

**Características principales**:
- [ ] **Gestión de Sensores**
  - Selector de sensores disponibles
  - Ver información de sensor (cliente, sucursal, modelo)
  - Activar/desactivar sensores

- [ ] **Registro Manual de Eventos**
  - Formulario para subir datos de temperatura/humedad
  - Selección de tipo de evento
  - Timestamp automático o manual
  - Batch upload (múltiples lecturas)

- [ ] **Visualización de Eventos**
  - Timeline de eventos por sensor
  - Filtros por fecha, tipo, sensor, cliente
  - Gráficas de temperatura/humedad
  - Alertas en tiempo real

- [ ] **Gestión de Créditos**
  - Ver balance de KOIL por cliente
  - Recargar créditos
  - Historial de consumo

**Stack Tecnológico Propuesto**:
- **Frontend**: Next.js 14 + TypeScript + TailwindCSS
- **Web3**: wagmi + viem + RainbowKit
- **State Management**: Zustand
- **Charts**: Recharts o Chart.js
- **UI Components**: shadcn/ui

**Páginas**:
```
/dashboard
  /sensors          - Lista de sensores
  /sensors/[id]     - Detalle de sensor con eventos
  /upload           - Subir eventos manualmente
  /events           - Vista de todos los eventos
  /clients          - Gestión de clientes
  /analytics        - Análisis y reportes
```

#### 2.2 Componentes del Dashboard

**Componente: Selector de Sensores**
```typescript
interface SensorSelectorProps {
  onSensorSelect: (sensor: Sensor) => void;
  clientFilter?: string;
  branchFilter?: string;
}

// Features:
// - Dropdown con búsqueda
// - Filtros por cliente/sucursal
// - Información de sensor en hover
// - Indicador de estado (activo/inactivo)
```

**Componente: Formulario de Evento**
```typescript
interface EventFormProps {
  sensor: Sensor;
  onSubmit: (event: SensorEvent) => void;
}

// Fields:
// - Sensor (pre-seleccionado o seleccionable)
// - Temperatura (°C, validación de rango)
// - Humedad (%, validación 0-100)
// - Tipo de evento (dropdown)
// - Timestamp (auto o manual)
// - Notas opcionales
```

**Componente: Event Timeline**
```typescript
interface EventTimelineProps {
  sensor: string;
  startDate?: Date;
  endDate?: Date;
  eventTypes?: EventType[];
}

// Features:
// - Timeline visual con iconos por tipo
// - Códigos de color por severidad
// - Detalles al hacer click
// - Export to CSV/PDF
```

---

### Fase 3: Backend Integration 🟡 (En Planificación)

#### 3.1 API Backend para IoT
**Estado**: 🔴 No iniciado
**Prioridad**: Media
**Descripción**: API REST para que dispositivos IoT envíen datos automáticamente

**Endpoints**:
```
POST /api/events
  - Recibir eventos desde dispositivos IoT
  - Validar y firmar transacciones
  - Batch processing

GET /api/sensors/:sensorUsername
  - Obtener información del sensor
  - Últimos eventos

GET /api/events
  - Listar eventos con filtros
  - Paginación

POST /api/sensors/register
  - Registrar nuevo sensor (admin)
```

**Stack Propuesto**:
- Node.js + Express o Next.js API Routes
- PostgreSQL para cache/indexing
- Redis para rate limiting
- ethers.js para interacción con contratos

#### 3.2 Backend Authorizer
**Estado**: 🔴 No iniciado
**Descripción**: Servicio que firma y envía transacciones como backend autorizado

**Funcionalidades**:
- [ ] Wallet management seguro (HSM o KMS)
- [ ] Rate limiting por sensor
- [ ] Queue system para transacciones
- [ ] Retry logic con exponential backoff
- [ ] Gas price optimization
- [ ] Alertas si balance ETH bajo

---

### Fase 4: Monitoreo y Alertas 🔴 (Futuro)

#### 4.1 Sistema de Alertas
**Estado**: 🔴 No iniciado
**Prioridad**: Media

**Características**:
- [ ] Email notifications
- [ ] SMS alerts (Twilio)
- [ ] Webhook notifications
- [ ] Push notifications (PWA)
- [ ] Configurable thresholds per sensor

#### 4.2 Analytics Dashboard
**Estado**: 🔴 No iniciado

**Características**:
- [ ] Reportes automáticos diarios/semanales
- [ ] Tendencias de temperatura/humedad
- [ ] Predicción de fallas
- [ ] Compliance reports
- [ ] Export to PDF/Excel

---

### Fase 5: Multi-Chain & Scaling 🔴 (Futuro)

#### 5.1 Layer 2 Integration
**Estado**: 🔴 No iniciado
**Descripción**: Deploy en Arbitrum, Optimism, Base para reducir costos

**Tareas**:
- [ ] Deploy en Arbitrum Sepolia
- [ ] Deploy en Base Sepolia
- [ ] Cross-chain bridge para créditos KOIL
- [ ] Multi-chain dashboard

#### 5.2 EVVM Fishers Integration
**Estado**: 🔴 No iniciado
**Descripción**: Usar EVVM Fishers para transacciones gasless

**Beneficios**:
- Usuarios no necesitan ETH
- Backend paga gas
- Mejor UX

---

## 📋 Orden de Implementación Recomendado

### Sprint 1 (2 semanas): NameService Automation
1. Script de firmas EIP-191
2. Proceso automatizado de registro
3. Tests de integración
4. Documentación

### Sprint 2 (3 semanas): Frontend MVP
1. Setup Next.js proyecto
2. Integración web3 (wagmi + RainbowKit)
3. Selector de sensores
4. Formulario de eventos manuales
5. Lista básica de eventos

### Sprint 3 (2 semanas): Dashboard Completo
1. Timeline de eventos
2. Gráficas de temperatura/humedad
3. Gestión de créditos
4. Filtros y búsqueda

### Sprint 4 (2 semanas): Backend API
1. API REST endpoints
2. Backend authorizer service
3. Queue system
4. Rate limiting

### Sprint 5 (1 semana): Alertas
1. Email notifications
2. Configurable thresholds
3. Alert dashboard

---

## 🎯 Quick Wins (Implementar Primero)

### 1. Script NameService Automation (3-5 días)
**Impacto**: Alto - Permite usar contrato de producción
**Esfuerzo**: Medio
**Archivo**: `scripts/nameservice-register.ts`

### 2. Frontend Simple - Formulario Manual (5-7 días)
**Impacto**: Alto - Permite probar el sistema visualmente
**Esfuerzo**: Bajo-Medio
**Stack**: Next.js + wagmi + shadcn/ui

### 3. API Básica de Consulta (2-3 días)
**Impacto**: Medio - Facilita queries al contrato
**Esfuerzo**: Bajo
**Endpoints**: GET eventos, GET sensores

---

## 📊 Métricas de Éxito

### Fase 1 (NameService)
- ✅ Registro de identidad < 5 minutos
- ✅ 100% automatización del proceso
- ✅ Zero errores de firma

### Fase 2 (Frontend)
- ✅ Tiempo de carga < 2 segundos
- ✅ Subir evento manual < 30 segundos
- ✅ Mobile responsive
- ✅ Soporte para 1000+ sensores

### Fase 3 (Backend)
- ✅ API response time < 200ms
- ✅ 99.9% uptime
- ✅ Procesar 100+ eventos/segundo

---

## 🔗 Enlaces Útiles

- **Contratos Desplegados**: [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)
- **Guías**: [KOILEN_INDEX.md](KOILEN_INDEX.md)
- **GitHub**: https://github.com/mexiweb3/Koilen

---

## 🤝 Contribuir

¿Quieres ayudar con alguna fase?
1. Revisa los issues en GitHub
2. Asigna una tarea de este roadmap
3. Crea un PR con tu implementación

**Prioridades actuales**:
1. 🔥 Script NameService automation
2. 🔥 Frontend MVP
3. 📊 Backend API

---

**Última actualización**: Noviembre 23, 2024
**Versión**: 1.0.0
