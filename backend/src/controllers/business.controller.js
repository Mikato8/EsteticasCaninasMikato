import pool, { query } from '../config/db.js'

const parseJsonColumn = (value, fallback = []) => {
  if (Array.isArray(value)) return value
  if (!value) return fallback
  try {
    return typeof value === 'string' ? JSON.parse(value) : value
  } catch {
    return fallback
  }
}

const toMysqlDateTime = (value) => {
  const date = value ? new Date(value) : new Date()
  return date.toISOString().slice(0, 19).replace('T', ' ')
}

export async function getBusinessDataController(req, res, next) {
  try {
    const { businessId } = req.params
    const [business] = await query('SELECT id, name, phone, email, address, color, theme, colors, language FROM businesses WHERE id = ? LIMIT 1', [
      businessId,
    ])

    if (!business) {
      return res.status(404).json({
        ok: false,
        message: 'Negocio no encontrado',
      })
    }

    const users = await query(
      'SELECT id, business_id, name, username, role, created_at FROM users WHERE business_id = ? ORDER BY created_at ASC',
      [businessId],
    )
    const [data] = await query('SELECT clients, services, products, packages, appointments, sales FROM business_data WHERE business_id = ? LIMIT 1', [
      businessId,
    ])

    return res.json({
      ok: true,
      account: {
        id: business.id,
        businessName: business.name,
        businessPhone: business.phone || '',
        businessEmail: business.email || '',
        businessAddress: business.address || '',
        businessColor: business.color || '#E06C4F',
        businessTheme: business.theme || 'coral',
        businessColors: parseJsonColumn(business.colors, {}),
        language: business.language || 'es',
        users: users.map((user) => ({
          id: user.id,
          business_id: user.business_id,
          name: user.name,
          username: user.username,
          password: '',
          role: user.role,
          createdAt: user.created_at,
        })),
        clients: parseJsonColumn(data?.clients),
        services: parseJsonColumn(data?.services),
        products: parseJsonColumn(data?.products),
        packages: parseJsonColumn(data?.packages),
        appointments: parseJsonColumn(data?.appointments),
        sales: parseJsonColumn(data?.sales),
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function saveBusinessDataController(req, res, next) {
  const connection = await pool.getConnection()
  try {
    const { businessId } = req.params
    const account = req.body

    await connection.beginTransaction()

    await connection.execute(
      `UPDATE businesses
       SET name = ?, phone = ?, email = ?, address = ?, color = ?, theme = ?, colors = ?, language = ?
       WHERE id = ?`,
      [
        account.businessName || 'Mi Negocio',
        account.businessPhone || '',
        account.businessEmail || '',
        account.businessAddress || '',
        account.businessColor || '#E06C4F',
        account.businessTheme || 'coral',
        JSON.stringify(account.businessColors || {}),
        account.language || 'es',
        businessId,
      ],
    )

    await connection.execute(
      `INSERT INTO business_data (business_id, clients, services, products, packages, appointments, sales)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         clients = VALUES(clients),
         services = VALUES(services),
         products = VALUES(products),
         packages = VALUES(packages),
         appointments = VALUES(appointments),
         sales = VALUES(sales)`,
      [
        businessId,
        JSON.stringify(account.clients || []),
        JSON.stringify(account.services || []),
        JSON.stringify(account.products || []),
        JSON.stringify(account.packages || []),
        JSON.stringify(account.appointments || []),
        JSON.stringify(account.sales || []),
      ],
    )

    const users = account.users || []
    const userIds = users.map((user) => user.id).filter(Boolean)
    if (users.length) {
      if (userIds.length) {
        const placeholders = userIds.map(() => '?').join(', ')
        await connection.execute(`DELETE FROM users WHERE business_id = ? AND id NOT IN (${placeholders})`, [businessId, ...userIds])
      }

      for (const user of users) {
        await connection.execute(
          `INSERT INTO users (id, business_id, name, username, password, role, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             name = VALUES(name),
             username = VALUES(username),
             password = IF(VALUES(password) = '', password, VALUES(password)),
             role = VALUES(role)`,
          [
            user.id,
            businessId,
            user.name || '',
            user.username || '',
            user.password || '',
            user.role || 'user',
            toMysqlDateTime(user.createdAt),
          ],
        )
      }
    }

    await connection.commit()
    return res.json({ ok: true })
  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    connection.release()
  }
}
