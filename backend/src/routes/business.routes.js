import { Router } from 'express'
import { getBusinessDataController, saveBusinessDataController } from '../controllers/business.controller.js'

const businessRouter = Router()

businessRouter.get('/:businessId/data', getBusinessDataController)
businessRouter.put('/:businessId/data', saveBusinessDataController)

export default businessRouter
