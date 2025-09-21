import { Router } from 'express';
import {
  getInventoryItems,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
} from '../controllers/inventoryController';

const router = Router();

// GET /api/inventory - Get all inventory items with pagination and filtering
router.get('/', getInventoryItems);

// GET /api/inventory/:id - Get single inventory item
router.get('/:id', getInventoryItem);

// POST /api/inventory - Create new inventory item
router.post('/', createInventoryItem);

// PUT /api/inventory/:id - Update inventory item
router.put('/:id', updateInventoryItem);

// DELETE /api/inventory/:id - Delete inventory item
router.delete('/:id', deleteInventoryItem);

export default router;