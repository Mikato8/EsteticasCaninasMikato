import { Router } from 'express'
import { query } from '../config/db.js'

const healthRouter = Router()

healthRouter.get('/', async (req, res, next) => {
  try {
    await query('SELECT 1')
    res.json({
      ok: true,
      service: 'mikato-backend',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

export default healthRouter
