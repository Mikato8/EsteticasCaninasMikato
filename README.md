# Mikato Software (Frontend + Backend)
Aplicación de gestión para estética canina con:
- Frontend: React + Vite
- Backend: Node.js + Express
- Base de datos: MySQL

## Requisitos
- Node.js 18+ (recomendado 20+)
- MySQL 8+ ejecutándose localmente

## 1) Instalar dependencias
Desde la raíz del proyecto:
```bash path=null start=null
npm install
```

## 2) Configurar variables de entorno
Crear el archivo `backend/.env` usando `backend/.env.example` como referencia.

Contenido sugerido:
```env path=null start=null
PORT=4000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=usuario
MYSQL_PASSWORD=1234
MYSQL_DATABASE=estilistas_caninos
MYSQL_CONNECTION_LIMIT=10
```

## 3) Crear/actualizar el esquema en MySQL
Ejecuta el script `backend/sql/schema.sql` para crear tablas necesarias.

Opción recomendada (sin cliente mysql instalado):
```bash path=null start=null
node --input-type=module -e "import fs from 'node:fs'; import mysql from 'mysql2/promise'; import dotenv from 'dotenv'; dotenv.config({ path: 'backend/.env' }); const sql = fs.readFileSync('backend/sql/schema.sql', 'utf8'); const conn = await mysql.createConnection({ host: process.env.MYSQL_HOST, port: Number(process.env.MYSQL_PORT), user: process.env.MYSQL_USER, password: process.env.MYSQL_PASSWORD, database: process.env.MYSQL_DATABASE, multipleStatements: true }); await conn.query(sql); await conn.end(); console.log('SCHEMA_UPDATED');"
```

## 4) Ejecutar el proyecto
Levanta frontend y backend al mismo tiempo:
```bash path=null start=null
npm run dev
```

Servicios:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000`
- Health check: `http://localhost:4000/api/health`

## Scripts disponibles
```bash path=null start=null
npm run dev            # frontend + backend
npm run dev:frontend   # solo frontend
npm run dev:backend    # solo backend (nodemon)
npm run start:backend  # backend en modo normal
npm run lint
npm run build
```

## Endpoints principales
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/businesses/:businessId/data`
- `PUT /api/businesses/:businessId/data`

## Troubleshooting
### 1) Error: `ECONNREFUSED 127.0.0.1:3306`
El backend no puede conectarse a MySQL.
- Verifica que MySQL esté encendido.
- Confirma host/puerto en `backend/.env`.
- Si usas otro puerto, actualiza `MYSQL_PORT`.

### 2) Error: `Access denied for user ...`
Credenciales inválidas o sin permisos.
- Revisa `MYSQL_USER` y `MYSQL_PASSWORD` en `backend/.env`.
- Asegúrate de que el usuario tenga permisos sobre `MYSQL_DATABASE`.

### 3) Backend no levanta y termina al iniciar
Suele ocurrir cuando no carga `.env` o falla DB.
- Revisa logs con `npm run dev:backend`.
- Confirma que exista `backend/.env`.
- Ejecuta el health check: `http://localhost:4000/api/health`.

### 4) Frontend no encuentra la API (`/api/...`)
- Verifica que backend esté corriendo en `http://localhost:4000`.
- Confirma proxy en `vite.config.js` para `/api`.
- Reinicia `npm run dev` después de cambiar configuración.

### 5) Tablas faltantes o cambios de esquema
Si aparecen errores de tablas inexistentes:
- Vuelve a aplicar `backend/sql/schema.sql`.
- Reinicia backend.

### 6) Puerto ocupado (5173 o 4000)
- Cambia puerto de frontend o backend.
- Backend: modifica `PORT` en `backend/.env`.
- Frontend: Vite propondrá otro puerto automáticamente.
