import { Enrollment, IEnrollment } from '../models/Enrollment.model';
import { Course } from '../models/Course.model';
import { ApiError } from '../utils/ApiError';
import mongoose from 'mongoose';

export class EnrollmentService {
  static async enroll(userId: string, courseId: string): Promise<IEnrollment> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError(404, 'Course not found');
    }

    if (course.status !== 'published') {
      throw new ApiError(400, 'Cannot enroll in a non-published course');
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    if (existing) {
      return existing;
    }

    const enrollment = await Enrollment.create({
      userId: new mongoose.Types.ObjectId(userId),
      courseId: new mongoose.Types.ObjectId(courseId),
      progress: 0,
      completedLessons: [],
      completedQuizzes: new Map(),
    });

    // Update course enrollment count
    course.enrolledCount += 1;
    await course.save();

    return enrollment;
  }

  static async getMyEnrollments(userId: string): Promise<IEnrollment[]> {
    return Enrollment.find({ userId: new mongoose.Types.ObjectId(userId) })
      .populate('courseId')
      .sort({ enrolledAt: -1 });
  }

  static async getEnrollmentForCourse(userId: string, courseId: string): Promise<IEnrollment | null> {
    return Enrollment.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      courseId: new mongoose.Types.ObjectId(courseId),
    });
  }
}
