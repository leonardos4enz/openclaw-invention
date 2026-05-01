# ERP empresarial - Plan maestro v2.0

## 🚀 Visión general

Sistema ERP empresarial modular con el módulo de **Compras** como primer módulo completo. Desarrollado para deploy en Vercel (serverless).

Incluye sistema de autorizaciones profesional, gráficos empresariales y Agentic AI.

---

## 🏗️ Arquitectura técnica

### Stack
- **Frontend:** Next.js 14 (App Router) + React + TailwindCSS + Recharts
- **Backend:** Next.js API Routes + Prisma ORM
- **Base de datos:** Turso (LibSQL) - SQLite en la nube, funciona en Vercel serverless ✅
- **Auth:** NextAuth.js (credentials + JWT)
- **Testing:** Playwright (E2E)
- **AI:** MiniMax API (agentic capabilities)
- **Repo:** https://github.com/leonardos4enz/openclaw-invention

### Estructura del proyecto
```
/app                    → Next.js App Router
  /api                  → API routes
    /auth               → NextAuth routes
    /compras            → Purchases API
      /requisiciones
      /cotizaciones
      /ordenes-compra
      /approvals        → Authorization workflow API
      /ai               → Agentic AI endpoints
    /dashboard          → Analytics API
  /(auth)               → Login, register pages
  /dashboard            → Main ERP dashboard
    /analytics          → Charts y KPIs
  /compras              → Modulo de compras
    /requisiciones
    /cotizaciones
    /ordenes-compra
    /approvals          → Authorization queue
/prisma                 → Schema de BD
/tests                  → Playwright E2E
  /compras
  /auth
```

---

## 🔐 Sistema de Autorizaciones Profesional

### Niveles de aprobación
```
Nivel 1 - Solicitante:    Crea requisiciones
Nivel 2 - Comprador:      Valida y envía a cotización
Nivel 3 - Supervisor:     Aprueba hasta $5,000 USD
Nivel 4 - Gerente:        Aprueba hasta $25,000 USD
Nivel 5 - Director:       Aprueba hasta $100,000 USD
Nivel 6 - CFO:            Aprueba +$100,000 USD
```

### Reglas de negocio
- Umbrales de aprobación por monto y departamento
- Antigüedad en puesto afecta límites
- Delegaciones cuando usuario está ausente
- Escalación automática si no se aprueba en 48h
- Historial de aprobación inmutable (audit trail)

### Estados de aprobación
```
pending → approved → rejected → escalation → override
```

### Permisos granulares
- CRUD por rol (admin, comprador, supervisor, viewer)
- Approval authority por departamento
- Temporal delegation con fecha expiry
- Emergency override con justificación obligatoria

---

## 📊 Gráficos y Analytics

### Dashboards
- **Spend Overview:** Gasto por período, categoría, proveedor
- **Approval Cycle Time:** Tiempo promedio de aprobación
- **Budget Utilization:** % usado por departamento
- **Supplier Performance:** Scorecard de proveedores
- **Cost Savings:** Optimizaciones conseguidas

### KPIs
- Purchase Order Cycle Time
- Approval Rate (approved vs rejected)
- Cost Variance (presupuestado vs real)
- Perfect Order Rate (on-time, full, no damages)
- Supplier Lead Time Accuracy

---

## 🤖 Agentic AI (Einstein)

### Capabilities
- **Intelligent Routing:** Analiza requisición y sugiere flujo de aprobación óptimo
- **Spend Insights:** Detecta anomalías y sugiere optimizaciones de costo
- **Auto-Categorization:** Clasifica items por categoría y proveedor sugerido
- **Lead Time Prediction:** Predice tiempos de entrega basado en historial
- **Approval Recommendation:** Sugiere approve/reject con reasoning
- **Natural Language Queries:** Preguntas en español sobre datos del sistema
- **Smart Notifications:** Mensajes proactivos cuando detecta problemas

### Implementation
- MiniMax API con clave del config
- Agente corre en API route `/api/compras/ai`
- Tools: analysis, routing, recommendations
- Contexto: toda la data del ERP

---

## 📦 Módulo de Compras - Funcionalidades

### 1. Autenticación
- Login con email/password
- JWT sessions
- Roles: admin, comprador, supervisor, director, cfo, viewer
- 2FA opcional

### 2. Requisiciones
- Crear requisición (solicitante, departamento, items, urgencia)
- Adjuntar archivos (PDFs, imágenes)
- Tracking de estado en tiempo real
- Historial completo de cambios
- Estados: draft, pending, approved, rejected

### 3. Cotizaciones
- Crear cotizaciones basadas en requisición
- Múltiples proveedores por requisición
- Comparar cotizaciones (tabla comparativa)
- Adjuntar propuesta comercial del proveedor
- Estados: draft, sent, received, accepted, rejected

### 4. Órdenes de Compra
- Generar OC desde cotización aprobada
- Email automático al proveedor (mock/SMTP)
- Tracking de entrega
- Historial deOCs
- Estados: draft, sent, partially_received, received, cancelled

### 5. Authorization Workflow
- Queue de aprobaciones pendientes
- Detalle de aprobación con contexto completo
- Approve/reject con comentarios obligatorios
- Delegaciones temporales
- Audit trail completo

### 6. Analytics & AI
- Dashboard con gráficos
- Reportes exportables (PDF/Excel)
- Einstein AI agent para consultas

---

## 📋 Plan de desarrollo

### Fase 1: Fundación ⚙️
- [ ] SPEC.md completo
- [ ] Setup Next.js con App Router
- [ ] Config Turso + Prisma
- [ ] Push to GitHub → Vercel auto-deploy
- [ ] Setup NextAuth.js
- [ ] .env.example (sin secretos reales)

### Fase 2: Auth 🔐
- [ ] Página de login con diseño profesional
- [ ] JWT y sesiones seguros
- [ ] Middleware de protección
- [ ] Manejo de roles granular
- [ ] Tests Playwright login

### Fase 3: Compras - Core 📝
- [ ] Schema Prisma completo
- [ ] API routes CRUD
- [ ] UI lista requisiciones
- [ ] UI crearrequisición
- [ ] Validación de datos
- [ ] Tests Playwright E2E

### Fase 4: Sistema de Autorizaciones 🔐
- [ ] Workflow de aprobación multinivel
- [ ] Queue de aprobaciones
- [ ] Delegaciones temporales
- [ ] Escalación automática
- [ ] Audit trail
- [ ] Tests Playwright

### Fase 5: Cotizaciones y OC 📝
- [ ] Sistema de cotizaciones
- [ ] Comparación de cotizaciones
- [ ] Generación de órdenes de compra
- [ ] Notificaciones por email
- [ ] Tests Playwright E2E

### Fase 6: Analytics 📊
- [ ] Dashboard con Recharts
- [ ] KPIs de compras
- [ ] Gráficos interactivos
- [ ] Reportes exportables
- [ ] Tests Playwright

### Fase 7: Agentic AI 🤖
- [ ] API route Einstein
- [ ] MiniMax integration
- [ ] Intelligent routing
- [ ] Spend insights
- [ ] Natural language queries
- [ ] Tests y validation

### Fase 8: Polish & Security 🔒
- [ ] Security audit
- [ ] Performance optimization
- [ ] Mobile responsive
- [ ] Documentación
- [ ] E2E tests completos
- [ ] Notificación final Leonardo

---

## 🔔 Notificaciones Telegram
- Leonardo será notificado al finalizar cada fase
- Cuando todo esté listo: link al repo + resumen completo

---

## 🏃‍♂️ Ejecución
**Inicio:** 2026-05-01 02:56 UTC
**Estado:** Plan v2.0 actualizado con AI + Auth profesional + Charts
**Heartbeat:** Cada 30 min
**Última actualización:** 2026-05-01 03:01 UTC
