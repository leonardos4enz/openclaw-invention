# ERP-Compras Development State

## Current Status
- **Phase:** 2 - Auth (CRITICAL ISSUE - users not in production DB)
- **Step:** Fix login - seed API created, UI modernized
- **Last updated:** 2026-05-01T03:52:00Z

## URGENT ISSUE
Production DB at `/tmp/prod.db` gets wiped on Vercel cold starts. 
Seed API created at `/api/seed` - user must click "Inicializar base de datos" button on login page.
UI login page has been redesigned with modern corporate look.

## Progress
- [x] Phase 1: Foundation - COMPLETE
- [x] Phase 2: Auth - PARTIAL (login works but DB needs seed)
- [x] Login page UI redesigned (modern corporate minimalista)
- [x] Seed API created at /api/seed
- [ ] Playwright E2E tests - NOT DONE - AGENT MUST DO THIS

## Next tasks (in order):
1. [ ] User must click "Inicializar base de datos" on login page
2. [ ] Run Playwright tests to verify login works
3. [ ] Test full flow: login → dashboard → requisiciones → create new requisicion
4. [ ] Modernize ALL remaining pages (dashboard, requisiciones, cotizaciones, etc.)
5. [ ] Continue with Phase 3+ development

## Current Login Credentials (after seed):
- admin@empresa.com / admin123 (admin, límite $1M)
- supervisor@empresa.com / super123 (supervisor, límite $25k)
- comprador@empresa.com / buyer123 (comprador, límite $5k)

## Playwright Tests Needed:
- `/tests/login.spec.ts` - Login flow
- `/tests/dashboard.spec.ts` - Dashboard access
- `/tests/requisiciones.spec.ts` - CRUD requisiciones
- `/tests/auth-flow.spec.ts` - Full E2E auth flow

## Deployment URL
https://openclaw-invention.vercel.app

## Notes
- Seed button on login page initializes DB with test users
- Agent must run Playwright tests BEFORE considering a phase complete
- Every commit should include tests

## Phases Remaining
- Phase 2: Auth - ALMOST DONE (need Playwright verification)
- Phase 3: Compras Core - IN PROGRESS
- Phase 4: Authorization Workflow
- Phase 5: Cotizaciones
- Phase 6: Purchase Orders
- Phase 7: Analytics (Recharts)
- Phase 8: Agentic AI (MiniMax)
- Phase 9: E2E Tests (Playwright) - AGENT MUST DO THIS
