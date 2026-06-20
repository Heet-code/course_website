import { Request, Response } from 'express';
import { Course } from '../models/Course.model';
import { User } from '../models/User.model';
import { Enrollment } from '../models/Enrollment.model';
import { Certificate } from '../models/Certificate.model';
import { AnalyticsEvent } from '../models/AnalyticsEvent.model';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import mongoose from 'mongoose';

export const getStudentDashboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Auth required');
  }

  const userId = req.user._id;

  const enrollments = await Enrollment.find({ userId }).populate('courseId');
  const certificatesCount = await Certificate.countDocuments({ recipientId: userId });

  const enrolledCount = enrollments.length;
  const completedCount = enrollments.filter((e) => e.progress === 100).length;

  res.status(200).json(
    new ApiResponse(
      200,
      {
        enrolledCount,
        completedCount,
        certificatesCount,
        enrollments,
      },
      'Student dashboard stats loaded'
    )
  );
});

export const getInstructorDashboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Auth required');
  }

  const instructorId = req.user._id;

  const courses = await Course.find({ instructorId });
  const totalEnrolled = courses.reduce((sum, c) => sum + c.enrolledCount, 0);
  const draftCount = courses.filter((c) => c.status === 'draft').length;
  const publishedCount = courses.filter((c) => c.status === 'published').length;

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalCourses: courses.length,
        totalEnrolled,
        draftCount,
        publishedCount,
        courses,
      },
      'Instructor dashboard stats loaded'
    )
  );
});

export const getAdminDashboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const totalCourses = await Course.countDocuments();
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalInstructors = await User.countDocuments({ role: 'instructor' });
  const totalCertificates = await Certificate.countDocuments();

  // Dummy analytics numbers
  const revenue = totalCourses * 49 + totalStudents * 15;
  const courseCompletionRate = totalStudents > 0 ? 32 : 0; // 32%

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalCourses,
        totalStudents,
        totalInstructors,
        totalCertificates,
        revenue,
        courseCompletionRate,
      },
      'Admin dashboard stats loaded'
    )
  );
});

export const getAnalyticsSummary = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Aggregate data securely without exposing IP or PII
  const totalEvents = await AnalyticsEvent.countDocuments();
  const enrollClicks = await AnalyticsEvent.countDocuments({ eventName: 'enroll_click' });
  const courseCardClicks = await AnalyticsEvent.countDocuments({ eventName: 'course_card_click' });
  const contactSubmissions = await AnalyticsEvent.countDocuments({ eventName: 'contact_submit_success' });
  const signupClicks = await AnalyticsEvent.countDocuments({ eventName: 'signup_click' });

  // Top courses
  const topCourses = await AnalyticsEvent.aggregate([
    { $match: { eventName: 'course_card_click', courseSlug: { $exists: true, $ne: null } } },
    { $group: { _id: '$courseSlug', clicks: { $sum: 1 } } },
    { $sort: { clicks: -1 } },
    { $limit: 5 }
  ]);

  const recentEvents = await AnalyticsEvent.find({}, { ipHash: 0, anonymousId: 0, userId: 0 })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalEvents,
        enrollClicks,
        courseCardClicks,
        contactSubmissions,
        signupClicks,
        topCourses: topCourses.map(tc => ({ slug: tc._id, clicks: tc.clicks })),
        recentEvents
      },
      'Analytics summary loaded'
    )
  );
});
