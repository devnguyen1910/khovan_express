import { Request, Response, NextFunction } from 'express';
import { Inventory, Shipment, Supplier } from '../models';
import { IApiResponse, IDashboardStats, ShipmentStatus } from '../types';

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [
      inventoryStats,
      shipmentStats,
      supplierCount
    ] = await Promise.all([
      Inventory.aggregate([
        {
          $group: {
            _id: null,
            totalItems: { $sum: '$quantity' },
            totalProducts: { $sum: 1 },
            lowStockItems: {
              $sum: { $cond: [{ $lt: ['$quantity', 10] }, 1, 0] }
            }
          }
        }
      ]),
      Shipment.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Supplier.countDocuments()
    ]);

    const inventory = inventoryStats[0] || { 
      totalItems: 0, 
      totalProducts: 0, 
      lowStockItems: 0 
    };
    
    const shipmentsByStatus = shipmentStats.reduce((acc: any, item: any) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const stats: IDashboardStats = {
      totalInventory: inventory.totalItems,
      inventoryValue: inventory.totalItems * 50000, // Mock calculation
      shipmentsInProgress: (shipmentsByStatus[ShipmentStatus.IN_TRANSIT] || 0) + 
                          (shipmentsByStatus[ShipmentStatus.PENDING] || 0),
      issues: (shipmentsByStatus[ShipmentStatus.DELAYED] || 0) + 
              (shipmentsByStatus[ShipmentStatus.CANCELLED] || 0)
    };

    const response: IApiResponse<IDashboardStats> = {
      success: true,
      data: stats
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getShipmentStatusDistribution = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const distribution = await Shipment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    const response: IApiResponse<Array<{ status: string; count: number }>> = {
      success: true,
      data: distribution
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getRecentActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { limit = 10 } = req.query;

    const recentShipments = await Shipment.find()
      .sort({ updatedAt: -1 })
      .limit(Number(limit))
      .select('trackingNumber status origin destination updatedAt');

    const recentInventory = await Inventory.find()
      .sort({ updatedAt: -1 })
      .limit(Number(limit))
      .select('name sku quantity updatedAt');

    const response: IApiResponse<{
      recentShipments: any[];
      recentInventory: any[];
    }> = {
      success: true,
      data: {
        recentShipments,
        recentInventory
      }
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};