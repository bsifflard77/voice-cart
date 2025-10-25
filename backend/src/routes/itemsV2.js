import express from 'express'
import * as itemsController from '../controllers/itemsControllerV2.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(authMiddleware)

// Item management routes (operate on items by ID)
router.put('/:id', itemsController.updateItem)
router.post('/:id/pickup', itemsController.markItemPickedUp)
router.delete('/:id', itemsController.deleteItem)

export default router
