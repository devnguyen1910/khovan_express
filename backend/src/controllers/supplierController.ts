import { Request, Response, NextFunction } from 'express';
import { Supplier, Inventory } from '../models';
import { IApiResponse, ISupplier } from '../types';

export const getSuppliers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, minRating } = req.query;
    
    const query: any = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by minimum rating
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [suppliers, total] = await Promise.all([
      Supplier.find(query)
        .sort({ rating: -1, name: 1 })
        .skip(skip)
        .limit(Number(limit)),
      Supplier.countDocuments(query)
    ]);
    
    // Update products supplied count for each supplier
    const suppliersWithProductCount = await Promise.all(
      suppliers.map(async (supplier: any) => {
        const count = await Inventory.countDocuments({ supplier: supplier.name });
        return {
          ...supplier.toObject(),
          productsSupplied: count
        };
      })
    );
    
    const response: IApiResponse<{
      suppliers: ISupplier[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }> = {
      success: true,
      data: {
        suppliers: suppliersWithProductCount,
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

export const getSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);
    
    if (!supplier) {
      res.status(404).json({
        success: false,
        error: 'Không tìm thấy nhà cung cấp'
      });
      return;
    }
    
    // Get actual products supplied count
    const productsSupplied = await Inventory.countDocuments({ 
      supplier: supplier.name 
    });
    
    const response: IApiResponse<ISupplier> = {
      success: true,
      data: {
        ...supplier.toObject(),
        productsSupplied
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const createSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const supplier = await Supplier.create(req.body);
    
    const response: IApiResponse<ISupplier> = {
      success: true,
      data: supplier,
      message: 'Nhà cung cấp đã được tạo thành công'
    };
    
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!supplier) {
      res.status(404).json({
        success: false,
        error: 'Không tìm thấy nhà cung cấp'
      });
      return;
    }
    
    const response: IApiResponse<ISupplier> = {
      success: true,
      data: supplier,
      message: 'Nhà cung cấp đã được cập nhật thành công'
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if supplier has products
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      res.status(404).json({
        success: false,
        error: 'Không tìm thấy nhà cung cấp'
      });
      return;
    }
    
    const productsCount = await Inventory.countDocuments({ 
      supplier: supplier.name 
    });
    
    if (productsCount > 0) {
      res.status(400).json({
        success: false,
        error: 'Không thể xóa nhà cung cấp vì vẫn còn sản phẩm trong kho'
      });
      return;
    }
    
    await Supplier.findByIdAndDelete(id);
    
    const response: IApiResponse<null> = {
      success: true,
      message: 'Nhà cung cấp đã được xóa thành công'
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};