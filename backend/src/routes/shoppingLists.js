import express from 'express'
import * as shoppingListsController from '../controllers/shoppingListsController.js'
import * as itemsController from '../controllers/itemsControllerV2.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(authMiddleware)

// Shopping list routes
router.get('/', shoppingListsController.getUserLists)
router.get('/:id', shoppingListsController.getListById)
router.post('/', shoppingListsController.createList)
router.put('/:id', shoppingListsController.updateList)
router.delete('/:id', shoppingListsController.deleteList)
router.post('/:id/complete', shoppingListsController.completeList)

// Items within shopping lists
router.get('/:listId/items', itemsController.getItemsByList)
router.post('/:listId/items', itemsController.createItem)

export default router
