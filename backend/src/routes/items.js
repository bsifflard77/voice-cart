import express from 'express'
import {
  getActiveItemsByStore,
  getPurchaseHistory,
  createItem,
  updateItem,
  markItemPickedUp,
  deleteItem,
} from '../controllers/itemsController.js'

const router = express.Router()

router.get('/store/:storeId', getActiveItemsByStore)
router.get('/store/:storeId/history', getPurchaseHistory)
router.post('/', createItem)
router.put('/:id', updateItem)
router.patch('/:id/pickup', markItemPickedUp)
router.delete('/:id', deleteItem)

export default router
