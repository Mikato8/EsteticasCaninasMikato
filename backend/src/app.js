import cors from 'cors'
import express from 'express'
import authRouter from './routes/auth.routes.js'
import businessRouter from './routes/business.routes.js'
import healthRouter from './routes/health.routes.js'
import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware.js'

const app = express()

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
)
app.use(express.json())

app.get('/api', (req, res) => {
  res.json({
    ok: true,
    message: 'Mikato API running',
  })
})

app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/businesses', businessRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app
