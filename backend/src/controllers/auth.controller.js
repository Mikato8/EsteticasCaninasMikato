import { randomUUID } from 'node:crypto'
import pool, { query } from '../config/db.js'
import { defaultDataSnapshot } from '../utils/default-data.js'
import { normalizeEmail, validateRecoverPayload } from '../utils/recovery.js'

export async function loginController(req, res, next) {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        ok: false,
        message: 'username y password son obligatorios',
      })
    }

    const users = await query(
      'SELECT id, business_id, name, username, role FROM users WHERE username = ? AND password = ? LIMIT 1',
      [username, password],
    )

    if (!users.length) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales inválidas',
      })
    }

    return res.json({
      ok: true,
      user: users[0],
    })
  } catch (error) {
    next(error)
  }
}

export async function registerController(req, res, next) {
  const connection = await pool.getConnection()
  try {
    const { businessName, businessPhone, businessEmail, businessAddress, name, username, password } = req.body

    if (!businessName || !name || !username || !password) {
      return res.status(400).json({
        ok: false,
        message: 'businessName, name, username y password son obligatorios',
      })
    }
    if (password.length < 4) {
      return res.status(400).json({
        ok: false,
        message: 'Contraseña mínimo 4 caracteres',
      })
    }

    const users = await query('SELECT id FROM users WHERE username = ? LIMIT 1', [username])
    if (users.length) {
      return res.status(409).json({
        ok: false,
        message: 'Ese usuario ya existe',
      })
    }

    const businessId = randomUUID()
    const userId = randomUUID()
    const defaults = defaultDataSnapshot()

    await connection.beginTransaction()
    await connection.execute(
      `INSERT INTO businesses (id, name, phone, email, address, color, theme, colors, language)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [businessId, businessName, businessPhone || '', businessEmail || '', businessAddress || '', '#E06C4F', 'coral', JSON.stringify({}), 'es'],
    )
    await connection.execute(
      `INSERT INTO users (id, business_id, name, username, password, role)
       VALUES (?, ?, ?, ?, ?, 'admin')`,
      [userId, businessId, name, username, password],
    )
    await connection.execute(
      `INSERT INTO business_data (business_id, clients, services, products, packages, appointments, sales)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        businessId,
        JSON.stringify(defaults.clients),
        JSON.stringify(defaults.services),
        JSON.stringify(defaults.products),
        JSON.stringify(defaults.packages),
        JSON.stringify(defaults.appointments),
        JSON.stringify(defaults.sales),
      ],
    )
    await connection.commit()

    return res.status(201).json({
      ok: true,
      user: {
        id: userId,
        business_id: businessId,
        name,
        username,
        role: 'admin',
      },
    })
  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    connection.release()
  }
}

export async function recoverController(req, res, next) {
  try {
    const { email, username, password } = req.body

    const validation = validateRecoverPayload({ email, username, password })
    if (!validation.ok) {
      return res.status(400).json({ ok: false, message: validation.message })
    }

    const rows = await query(
      `SELECT u.id
       FROM users u
       JOIN businesses b ON b.id = u.business_id
       WHERE u.username = ? AND LOWER(b.email) = ?
       LIMIT 1`,
      [username, normalizeEmail(email)],
    )

    if (!rows.length) {
      return res.status(404).json({
        ok: false,
        message: 'No encontramos una cuenta con ese usuario y e-mail',
      })
    }

    await query('UPDATE users SET password = ? WHERE id = ?', [password, rows[0].id])

    return res.json({ ok: true })
  } catch (error) {
    next(error)
  }
}