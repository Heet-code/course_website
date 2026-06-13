import { Request, Response } from 'express';
import { CourseService } from '../services/course.service';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export const getCourses = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { category, difficulty, search, instructorId, priceType, status } = req.query;
  
  const courses = await CourseService.getCourses({
    category: category as string,
    difficulty: difficulty as string,
    search: search as string,
    instructorId: instructorId as string,
    priceType: priceType as string,
    status: status as string,
  });

  res
    .status(200)
    .json(new ApiResponse(200, courses, 'Courses retrieved successfully'));
});

export const getCourseBySlug = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const course = await CourseService.getCourseByIdOrSlug(req.params.slug);
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }
  res
    .status(200)
    .json(new ApiResponse(200, course, 'Course retrieved successfully'));
});

export const createCourse = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Auth required');
  }

  const course = await CourseService.createCourse(req.body, req.user._id.toString(), req.user.name);
  
  res
    .status(201)
    .json(new ApiResponse(201, course, 'Course created successfully'));
});

export const updateCourse = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Auth required');
  }

  const course = await CourseService.updateCourse(req.params.id, req.body, req.user._id.toString());
  
  res
    .status(200)
    .json(new ApiResponse(200, course, 'Course updated successfully'));
});

export const deleteCourse = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Auth required');
  }

  await CourseService.deleteCourse(req.params.id, req.user._id.toString());
  
  res
    .status(200)
    .json(new ApiResponse(200, null, 'Course deleted successfully'));
});

export const changeCourseStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Auth required');
  }

  const { status } = req.body;
  if (!status || !['published', 'draft'].includes(status)) {
    throw new ApiError(400, 'Invalid status update');
  }

  const course = await CourseService.changeStatus(req.params.id, status, req.user._id.toString());

  res
    .status(200)
    .json(new ApiResponse(200, course, 'Course status updated successfully'));
});
