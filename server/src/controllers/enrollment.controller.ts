import { Request, Response } from 'express';
import { EnrollmentService } from '../services/enrollment.service';
import { Course } from '../models/Course.model';
import { emailService } from '../services/email.service';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export const enrollInCourse = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Auth required');
  }

  const enrollment = await EnrollmentService.enroll(req.user._id.toString(), req.params.courseId);

  // Send enrollment confirmation email
  const course = await Course.findById(req.params.courseId).select('title');
  if (course) {
    emailService.sendEnrollmentEmail(req.user.email, req.user.name, course.title);
  }

  res
    .status(201)
    .json(new ApiResponse(201, enrollment, 'Enrolled in course successfully'));
});

export const getMyEnrollments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Auth required');
  }

  const enrollments = await EnrollmentService.getMyEnrollments(req.user._id.toString());

  res
    .status(200)
    .json(new ApiResponse(200, enrollments, 'Enrollments retrieved successfully'));
});

export const getCourseEnrollment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Auth required');
  }

  const enrollment = await EnrollmentService.getEnrollmentForCourse(
    req.user._id.toString(),
    req.params.courseId
  );

  res
    .status(200)
    .json(new ApiResponse(200, enrollment, 'Enrollment status retrieved successfully'));
});
