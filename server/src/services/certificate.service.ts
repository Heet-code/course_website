import { Certificate, ICertificate } from '../models/Certificate.model';
import { Enrollment } from '../models/Enrollment.model';
import { Course } from '../models/Course.model';
import { User } from '../models/User.model';
import { ApiError } from '../utils/ApiError';
import mongoose from 'mongoose';

export class CertificateService {
  static async generateCertificate(userId: string, courseId: string): Promise<ICertificate> {
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);
    
    if (!user || !course) {
      throw new ApiError(404, 'User or course not found');
    }

    const enrollment = await Enrollment.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    if (!enrollment) {
      throw new ApiError(400, 'Student is not enrolled in this course');
    }

    // Double check if already issued
    const existing = await Certificate.findOne({
      recipientId: new mongoose.Types.ObjectId(userId),
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    if (existing) {
      return existing;
    }

    // Verify progress is 100% or that all lessons are completed
    const totalLessons = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
    const completedCount = enrollment.completedLessons.length;
    
    if (totalLessons > 0 && completedCount < totalLessons) {
      throw new ApiError(400, `Course is not fully completed yet. Completed ${completedCount}/${totalLessons} lessons.`);
    }

    // Generate unique credential code
    const uniquePart1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const uniquePart2 = Math.random().toString(36).substring(2, 8).toUpperCase();
    const credentialId = `Veloria Academy-CERT-${uniquePart1}-${uniquePart2}`;

    const certificate = await Certificate.create({
      courseId: course._id,
      courseTitle: course.title,
      recipientId: user._id,
      recipientName: user.name,
      instructorName: course.instructorName,
      issueDate: new Date(),
      credentialId,
    });

    // Link certificate to enrollment
    enrollment.certificateId = certificate.credentialId;
    await enrollment.save();

    return certificate;
  }

  static async getCertificateByCredentialId(credentialId: string): Promise<ICertificate | null> {
    return Certificate.findOne({ credentialId });
  }

  static async getMyCertificates(userId: string): Promise<ICertificate[]> {
    return Certificate.find({ recipientId: new mongoose.Types.ObjectId(userId) });
  }
}
