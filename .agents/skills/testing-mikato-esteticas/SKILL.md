---
name: testing-mikato-esteticas
description: Test the Mikato dog-grooming app end-to-end (React + Express + MySQL). Use when verifying UI/API changes to Clientes, Citas, POS, Ventas, or features like the breed search.
---

# Testing Mikato Estéticas Caninas

Full-stack app: React 19/Vite frontend (:5173) + Express backend (:4000) + MySQL 8 (Docker).
Multi-tenant: each business is a separate account; data is stored as a JSON snapshot per business.

## Bring the app up locally
MySQL does NOT persist as a service — start it each session:
```bash
docker start mikato-mysql 2>/dev/null || docker run -d --name mikato-mysql \
  -e MYSQL_ROOT_PASSWORD=1234 -e MYSQL_DATABASE=estilistas_caninos -p 3306:3306 mysql:8
```
Then apply the schema (idempotent) and start dev. The MySQL password may not be in `backend/.env`; if the schema script fails auth, fall back to `1234` (the value the blueprint uses for the container). Apply schema with the one-liner in the environment blueprint's `startup` section, then:
```bash
npm run dev   # runs frontend + backend concurrently; wait for "✅ MySQL conectado" and "Backend listo"
```

## Logging in (setup, do NOT record)
There is no seeded login. On the login screen click **"Crear mi negocio"** and register: business name, your name, phone, email, username, password (min 4 chars), address. Registration auto-logs-in and seeds one demo client (María García / Poodle). This is the fastest path to a working session.

## Reaching features
- Sidebar (left) has: Panel, Citas, Punto de Venta, Clientes, Ventas, Usuarios, Configuración.
- **Clientes y Mascotas**: "Nuevo" button (top-right of card) opens the client modal. Fields: Nombre, Teléfono, Email, Especie (Perro/Gato), Mascota, Raza, Tamaño, Edad, Notas.

## Breed search feature (PR #6)
The Raza field is a searchable combobox (`src/components/common/BreedSearch.jsx`) backed by `src/constants/breeds.js`.
Key behaviors to verify:
- Typing filters a dropdown showing `Especie · Talla · peso kg · vida años`.
- Selecting an option auto-fills Especie + Tamaño and shows a hint line under Raza.
- The Especie select (Perro/Gato) filters which breeds appear.
- Search ignores accents/case (e.g. "poodle" matches "Caniche (Poodle)").
- Free text not in the catalog is still accepted and saved.

## Gotchas
- The client form's *Edad* is the pet's real age; the breed's life expectancy is only shown in the hint and never overwrites Edad. Don't assert Edad changes on breed select.
- Existing clients saved before the especie field default to "Perro" when edited (backward compatible).
- Data persists in MySQL for the registered business; re-running tests accumulates rows — that's expected.

## Commands
- Lint: `npm run lint` (oxlint)
- Unit tests: `npm test` (`node --test`)
- Build: `npm run build`

## Devin Secrets Needed
None. The app runs fully locally with a Docker MySQL; no external credentials/API keys are required.
