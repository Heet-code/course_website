import { Request, Response } from 'express';
import { Enrollment } from '../models/Enrollment.model';
import { Course } from '../models/Course.model';
import { Progress } from '../models/Progress.model';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import mongoose from 'mongoose';

export const getProgress = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Auth required');
  }

  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: new mongoose.Types.ObjectId(req.params.courseId),
  });

  if (!enrollment) {
    throw new ApiError(404, 'Enrollment not found for this course');
  }

  res
    .status(200)
    .json(new ApiResponse(200, enrollment, 'Progress status retrieved successfully'));
});

export const completeLesson = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Auth required');
  }

  const { courseId, lessonId } = req.params;

  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: new mongoose.Types.ObjectId(courseId),
  });

  if (!enrollment) {
    throw new ApiError(404, 'Enrollment not found for this course');
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  // Add lesson to completed array if not already there
  if (!enrollment.completedLessons.includes(lessonId)) {
    enrollment.completedLessons.push(lessonId);
  }

  // Recalculate percentage progress
  const totalLessons = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
  if (totalLessons > 0) {
    enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
  } else {
    enrollment.progress = 100;
  }

  await enrollment.save();

  // Record in Progress log
  await Progress.findOneAndUpdate(
    { userId: req.user._id, courseId: new mongoose.Types.ObjectId(courseId), lessonId },
    { completed: true, completedAt: new Date() },
    { upsert: true, new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, enrollment, 'Lesson marked as completed successfully'));
});

export const uncompleteLesson = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Auth required');
  }

  const { courseId, lessonId } = req.params;

  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: new mongoose.Types.ObjectId(courseId),
  });

  if (!enrollment) {
    throw new ApiError(404, 'Enrollment not found for this course');
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  // Remove lesson from completed array
  enrollment.completedLessons = enrollment.completedLessons.filter((id) => id !== lessonId);

  // Recalculate percentage progress
  const totalLessons = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
  if (totalLessons > 0) {
    enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
  } else {
    enrollment.progress = 0;
  }

  await enrollment.save();

  // Delete from Progress log
  await Progress.deleteOne({
    userId: req.user._id,
    courseId: new mongoose.Types.ObjectId(courseId),
    lessonId,
  });

  res
    .status(200)
    .json(new ApiResponse(200, enrollment, 'Lesson marked as incomplete successfully'));
});
