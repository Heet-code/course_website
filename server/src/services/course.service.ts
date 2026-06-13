import { Course, ICourse } from '../models/Course.model';
import { generateSlug } from '../utils/generateSlug';
import { ApiError } from '../utils/ApiError';
import mongoose from 'mongoose';

export class CourseService {
  static async getCourses(filters?: {
    category?: string;
    difficulty?: string;
    search?: string;
    instructorId?: string;
    priceType?: string;
    status?: string;
  }): Promise<ICourse[]> {
    const query: any = {};

    if (filters?.category) {
      query.category = { $regex: new RegExp(`^${filters.category}$`, 'i') };
    }

    if (filters?.difficulty) {
      query.difficulty = filters.difficulty;
    }

    if (filters?.instructorId) {
      query.instructorId = new mongoose.Types.ObjectId(filters.instructorId);
    } else {
      // By default, list only published courses for students/guests
      query.status = filters?.status || 'published';
    }

    if (filters?.priceType) {
      const type = filters.priceType.toLowerCase();
      if (type === 'free') {
        query.isFree = true;
      } else if (type === 'paid') {
        query.isFree = false;
      }
    }

    if (filters?.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { instructorName: searchRegex },
      ];
    }

    return Course.find(query).sort({ createdAt: -1 });
  }

  static async getCourseByIdOrSlug(idOrSlug: string): Promise<ICourse | null> {
    const isValidId = mongoose.Types.ObjectId.isValid(idOrSlug);
    if (isValidId) {
      return Course.findById(idOrSlug);
    }
    return Course.findOne({ slug: idOrSlug.toLowerCase() });
  }

  static async createCourse(
    courseData: Partial<ICourse> & { title: string },
    instructorId: string,
    instructorName: string
  ): Promise<ICourse> {
    const slug = generateSlug(courseData.title);
    
    // Check if slug exists
    const existing = await Course.findOne({ slug });
    const finalSlug = existing ? `${slug}-${Math.random().toString(36).substring(2, 6)}` : slug;

    const newCourse = await Course.create({
      ...courseData,
      slug: finalSlug,
      instructorId: new mongoose.Types.ObjectId(instructorId),
      instructorName,
      status: 'draft', // defaults to draft
    });

    return newCourse;
  }

  static async updateCourse(
    courseId: string,
    courseData: Partial<ICourse>,
    instructorId: string
  ): Promise<ICourse> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError(404, 'Course not found');
    }

    // Check ownership
    if (course.instructorId.toString() !== instructorId) {
      throw new ApiError(403, 'You do not have permission to modify this course');
    }

    if (courseData.title && courseData.title !== course.title) {
      course.slug = generateSlug(courseData.title);
    }

    Object.assign(course, courseData);
    await course.save();

    return course;
  }

  static async deleteCourse(courseId: string, instructorId: string): Promise<void> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError(404, 'Course not found');
    }

    if (course.instructorId.toString() !== instructorId) {
      throw new ApiError(403, 'You do not have permission to delete this course');
    }

    await Course.deleteOne({ _id: courseId });
  }

  static async changeStatus(courseId: string, status: 'published' | 'draft', instructorId: string): Promise<ICourse> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError(404, 'Course not found');
    }

    if (course.instructorId.toString() !== instructorId) {
      throw new ApiError(403, 'You do not have permission to update this course status');
    }

    course.status = status;
    await course.save();
    return course;
  }
}
