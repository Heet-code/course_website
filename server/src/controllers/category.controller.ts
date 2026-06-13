import { Request, Response } from 'express';
import { Category } from '../models/Category.model';
import { Course } from '../models/Course.model';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Read all categories
  const categories = await Category.find().sort({ count: -1 });
  
  // Dynamically sync counts from course model in case they changed
  const syncedCategories = await Promise.all(
    categories.map(async (cat) => {
      const count = await Course.countDocuments({ category: cat.name, status: 'published' });
      cat.count = count;
      await cat.save();
      return cat;
    })
  );

  res
    .status(200)
    .json(new ApiResponse(200, syncedCategories, 'Categories retrieved successfully'));
});

export const createCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, icon } = req.body;
  const newCat = await Category.create({ name, icon, count: 0 });
  
  res
    .status(201)
    .json(new ApiResponse(201, newCat, 'Category created successfully'));
});
