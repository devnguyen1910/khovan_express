import { Request, Response, NextFunction } from 'express';
import { Shipment } from '../models';
import { IApiResponse, IShipment, ShipmentStatus } from '../types';

export const getShipments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, status, origin, destination } = req.query;
    
    const query: any = {};
    
    // Filter by status
    if (status && Object.values(ShipmentStatus).includes(status as ShipmentStatus)) {
      query.status = status;
    }
    
    // Filter by origin
    if (origin) {
      query.origin = { $regex: origin, $options: 'i' };
    }
    
    // Filter by destination
    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [shipments, total] = await Promise.all([
      Shipment.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Shipment.countDocuments(query)
    ]);
    
    const response: IApiResponse<{
      shipments: IShipment[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }> = {
      success: true,
      data: {
        shipments,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getShipment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const shipment = await Shipment.findById(id);
    
    if (!shipment) {
      res.status(404).json({
        success: false,
        error: 'Không tìm thấy lô hàng'
      });
      return;
    }
    
    const response: IApiResponse<IShipment> = {
      success: true,
      data: shipment
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getShipmentByTracking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { trackingNumber } = req.params;
    const shipment = await Shipment.findOne({ 
      trackingNumber: trackingNumber.toUpperCase() 
    });
    
    if (!shipment) {
      res.status(404).json({
        success: false,
        error: 'Không tìm thấy lô hàng với mã vận đơn này'
      });
      return;
    }
    
    const response: IApiResponse<IShipment> = {
      success: true,
      data: shipment
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const createShipment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const shipment = await Shipment.create(req.body);
    
    const response: IApiResponse<IShipment> = {
      success: true,
      data: shipment,
      message: 'Lô hàng đã được tạo thành công'
    };
    
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateShipment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const shipment = await Shipment.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!shipment) {
      res.status(404).json({
        success: false,
        error: 'Không tìm thấy lô hàng'
      });
      return;
    }
    
    const response: IApiResponse<IShipment> = {
      success: true,
      data: shipment,
      message: 'Lô hàng đã được cập nhật thành công'
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateShipmentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!Object.values(ShipmentStatus).includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Trạng thái không hợp lệ'
      });
      return;
    }
    
    const shipment = await Shipment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!shipment) {
      res.status(404).json({
        success: false,
        error: 'Không tìm thấy lô hàng'
      });
      return;
    }
    
    const response: IApiResponse<IShipment> = {
      success: true,
      data: shipment,
      message: 'Trạng thái lô hàng đã được cập nhật'
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteShipment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const shipment = await Shipment.findByIdAndDelete(id);
    
    if (!shipment) {
      res.status(404).json({
        success: false,
        error: 'Không tìm thấy lô hàng'
      });
      return;
    }
    
    const response: IApiResponse<null> = {
      success: true,
      message: 'Lô hàng đã được xóa thành công'
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};