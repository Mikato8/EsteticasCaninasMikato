import { Router } from 'express'
import { loginController, recoverController, registerController } from '../controllers/auth.controller.js'

const authRouter = Router()

authRouter.post('/login', loginController)
authRouter.post('/register', registerController)
authRouter.post('/recover', recoverController)

export default authRouter
