# ERP empresarial - Plan maestro

## 🚀 Visión general

Sistema ERP empresarial modular con el módulo de **Compras** como primer módulo completo. Desarrollado para deploy en Vercel (serverless).

---

## 🏗️ Arquitectura técnica

### Stack
- **Frontend:** Next.js 14 (App Router) + React + TailwindCSS
- **Backend:** Next.js API Routes + Prisma ORM
- **Base de datos:** Turso (LibSQL) - SQLite en la nube, funciona en Vercel serverless ✅
- **Auth:** NextAuth.js (credentials + JWT)
- **Testing:** Playwright (E2E)
- **Repo:** https://github.com/leonardos4enz/openclaw-invention

### Estructura del proyecto
```
/app                  → Next.js App Router
  /api                → API routes
  /(auth)             → Login, register pages
  /dashboard          → Main ERP dashboard
  /compras             → Modulo de compras
    /requisiciones
    /cotizaciones
    /ordenes-compra
/prisma               → Schema de BD
/tests                → Playwright E2E
```

---

## 📦 Módulo de Compras - Funcionalidades

### 1. Autenticación
- Login con email/password
- JWT sessions
- Roles: admin, comprador, viewer

### 2. Requisiciones
- Crear requisición (solicitante, departamento, items, urgencia)
- Aprobar/rechazar requisiciones (solo admin)
- Historial de requisiciones
- Estados: draft, pending, approved, rejected

### 3. Cotizaciones
- Crear cotizaciones basadas en requisición
- Múltiples proveedores por requisición
- Comparar cotizaciones (tabla comparativa)
- Estados: draft, sent, received, accepted, rejected

### 4. Órdenes de Compra
- Generar OC desde cotización aprobada
- Envío por email al proveedor (mock)
- Historial deOCs
- Estados: draft, sent, partially_received, received, cancelled

---

## 📋 Plan de desarrollo (TaskFlow)

### Fase 1: Fundación ⚙️
- [ ] SPEC.md completo
- [ ] Setup Next.js con App Router
- [ ] Config Turso + Prisma
- [ ] Config Git + push a Vercel
- [ ] Setup NextAuth.js

### Fase 2: Auth 🔐
- [ ] Pagina de login
- [ ] JWT y sesiones
- [ ] Middleware de protección
- [ ] Tests Playwright login

### Fase 3: Compras - Core 📝
- [ ] Schema Prisma (requisiciones, cotizaciones, OC)
- [ ] API routes CRUD
- [ ] UI lista de requisiciones
- [ ] UI crearrequisición
- [ ] Tests Playwright

### Fase 4: Compras - Workflow 🔄
- [ ] Aprobación de requisiciones
- [ ] Sistema de cotizaciones
- [ ] Comparación de cotizaciones
- [ ] Generación de OC
- [ ] Tests Playwright E2E

### Fase 5: Notificaciones 🔔
- [ ] Notificaciones Telegram al completar fases
- [ ] Heartbeat de desarrollo infinito

---

## 🔔 Notificaciones Telegram
- Leonardo será notificado por @Einsteint_agentic_bot al finalizar cada fase
- Cuando todo esté listo, Leonardo recibirá mensaje con link al repo

---

## 🏃‍♂️ Ejecución
**Inicio:** Ahora (heartbeat activo)
**Estado:** Fase 1 - Iniciando fundación
**Última actualización:** 2026-05-01 02:56 UTC
