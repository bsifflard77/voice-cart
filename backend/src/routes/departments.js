import express from 'express'
import {
  getDepartmentsByStore,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentsController.js'

const router = express.Router()

router.get('/store/:storeId', getDepartmentsByStore)
router.get('/:id', getDepartmentById)
router.post('/', createDepartment)
router.put('/:id', updateDepartment)
router.delete('/:id', deleteDepartment)

export default router
