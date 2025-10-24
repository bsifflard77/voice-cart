import express from 'express'
import {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
} from '../controllers/storesController.js'

const router = express.Router()

router.get('/', getAllStores)
router.get('/:id', getStoreById)
router.post('/', createStore)
router.put('/:id', updateStore)
router.delete('/:id', deleteStore)

export default router
