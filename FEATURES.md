# ERP Feature Tracker

## Status: IN_PROGRESS

---

## Completed ✅

### Authentication
- [x] Login page `/login`
- [x] Register page `/register`

### Dashboard
- [x] Main dashboard `/dashboard`
- [x] Analytics page `/dashboard/analytics`

### Compras Module - Requisiciones
- [x] Lista requisiciones `/dashboard/compras/requisiciones`
- [x] Nueva requisición `/dashboard/compras/requisiciones/nueva`
- [x] Detalle requisición `/dashboard/compras/requisiciones/[id]`
- [x] Editar requisición `/dashboard/compras/requisiciones/[id]/editar`
- [x] API: GET/POST `/api/compras/requisiciones`
- [x] API: GET/PATCH/PUT/DELETE `/api/compras/requisiciones/[id]`

### Compras Module - Órdenes de Compra
- [x] Lista órdenes de compra `/dashboard/compras/ordenes-compra`
- [x] Nueva orden de compra `/dashboard/compras/ordenes-compra/nueva`
- [x] Detalle orden de compra `/dashboard/compras/ordenes-compra/[id]`
- [x] Editar orden de compra `/dashboard/compras/ordenes-compra/[id]/editar`
- [x] API: GET/POST `/api/compras/ordenes-compra`
- [x] API: GET/PATCH/PUT/DELETE `/api/compras/ordenes-compra/[id]`

### Compras Module - Cotizaciones
- [x] Lista cotizaciones `/dashboard/compras/cotizaciones`
- [x] Nueva cotización `/dashboard/compras/cotizaciones/nueva`
- [x] Detalle cotización `/dashboard/compras/cotizaciones/[id]`
- [x] API: GET/POST `/api/compras/cotizaciones`
- [x] API: GET/PATCH/PUT/DELETE `/api/compras/cotizaciones/[id]`

### Compras Module - Approvals
- [x] Lista aprobaciones `/dashboard/compras/approvals`

---

## Pending 🔴

### Additional Features
- [ ] Crear orden de compra desde cotización aceptada
- [ ] Filtros funcionales en listas (estado, departamento, fecha)
- [ ] Búsqueda en requisiciones y órdenes
- [ ] Paginación de resultados
- [ ] Historial de cambios/audit log viewer

### Module: Ventas (placeholder)
- [ ] Dashboard de ventas
- [ ] Órdenes de venta
- [ ] Clientes

### Module: Inventario
- [ ] Dashboard de inventario
- [ ] Productos
- [ ] Entradas/Salidas

### Module: Finanzas
- [ ] Dashboard financiero
- [ ] Cuentas por pagar
- [ ] Cuentas por cobrar

### Module: Usuarios
- [ ] Lista de usuarios
- [ ] Crear/editar usuario
- [ ] Gestión de roles y permisos

### Module: Configuración
- [ ] Configuración general
- [ ] Categorías de productos
- [ ] Proveedores

---

## Routes Structure

```
/login
/register
/dashboard
  /dashboard/analytics

/dashboard/compras
  /dashboard/compras/requisiciones
    /dashboard/compras/requisiciones/nueva
    /dashboard/compras/requisiciones/[id]
    /dashboard/compras/requisiciones/[id]/editar
  /dashboard/compras/cotizaciones
    /dashboard/compras/cotizaciones/nueva
    /dashboard/compras/cotizaciones/[id]
  /dashboard/compras/ordenes-compra
    /dashboard/compras/ordenes-compra/nueva
    /dashboard/compras/ordenes-compra/[id]
    /dashboard/compras/ordenes-compra/[id]/editar
  /dashboard/compras/approvals
```

---

_Last Updated: 2026-05-01_