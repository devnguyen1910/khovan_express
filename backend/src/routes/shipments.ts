import { Router } from 'express';
import {
  getShipments,
  getShipment,
  getShipmentByTracking,
  createShipment,
  updateShipment,
  updateShipmentStatus,
  deleteShipment
} from '../controllers/shipmentController';

const router = Router();

// GET /api/shipments - Get all shipments with pagination and filtering
router.get('/', getShipments);

// GET /api/shipments/track/:trackingNumber - Get shipment by tracking number
router.get('/track/:trackingNumber', getShipmentByTracking);

// GET /api/shipments/:id - Get single shipment
router.get('/:id', getShipment);

// POST /api/shipments - Create new shipment
router.post('/', createShipment);

// PUT /api/shipments/:id - Update shipment
router.put('/:id', updateShipment);

// PATCH /api/shipments/:id/status - Update shipment status only
router.patch('/:id/status', updateShipmentStatus);

// DELETE /api/shipments/:id - Delete shipment
router.delete('/:id', deleteShipment);

export default router;