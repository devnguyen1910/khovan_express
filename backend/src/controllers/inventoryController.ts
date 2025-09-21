import { Request, Response, NextFunction } from 'express';
import { Inventory } from '../models';
import { IApiResponse, IInventoryItem } from '../types';

export const getInventoryItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, location, lowStock } = req.query;
    
    const query: any = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { supplier: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    // Filter low stock items
    if (lowStock === 'true') {
      query.quantity = { $lt: 10 };
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [items, total] = await Promise.all([
      Inventory.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Inventory.countDocuments(query)
    ]);
    
    const response: IApiResponse<{
      items: IInventoryItem[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }> = {
      success: true,
      data: {
        items,
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

export const getInventoryItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Inventory.findById(id);
    
    if (!item) {
      res.status(404).json({
        success: false,
        error: 'Không tìm thấy sản phẩm'
      });
      return;
    }
    
    const response: IApiResponse<IInventoryItem> = {
      success: true,
      data: item
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const createInventoryItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const item = await Inventory.create(req.body);
    
    const response: IApiResponse<IInventoryItem> = {
      success: true,
      data: item,
      message: 'Sản phẩm đã được tạo thành công'
    };
    
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateInventoryItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Inventory.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!item) {
      res.status(404).json({
        success: false,
        error: 'Không tìm thấy sản phẩm'
      });
      return;
    }
    
    const response: IApiResponse<IInventoryItem> = {
      success: true,
      data: item,
      message: 'Sản phẩm đã được cập nhật thành công'
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteInventoryItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Inventory.findByIdAndDelete(id);
    
    if (!item) {
      res.status(404).json({
        success: false,
        error: 'Không tìm thấy sản phẩm'
      });
      return;
    }
    
    const response: IApiResponse<null> = {
      success: true,
      message: 'Sản phẩm đã được xóa thành công'
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};