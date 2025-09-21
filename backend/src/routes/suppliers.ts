import { Router } from 'express';
import {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from '../controllers/supplierController';

const router = Router();

// GET /api/suppliers - Get all suppliers with pagination and filtering
router.get('/', getSuppliers);

// GET /api/suppliers/:id - Get single supplier
router.get('/:id', getSupplier);

// POST /api/suppliers - Create new supplier
router.post('/', createSupplier);

// PUT /api/suppliers/:id - Update supplier
router.put('/:id', updateSupplier);

// DELETE /api/suppliers/:id - Delete supplier
router.delete('/:id', deleteSupplier);

export default router;