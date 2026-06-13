export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  title?: string; // e.g., "Senior Software Engineer" for instructors
  joinedDate: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string; // e.g., "12:30"
  description: string;
  videoUrl: string; // Placeholder URL
  resources: string[]; // List of file names/links
  isPreview?: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  passingScore: number; // e.g., 70
}

export interface Course {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string; // e.g., "8h 45m"
  isFree: boolean;
  price?: number;
  instructorName: string;
  instructorId: string;
  rating: number;
  enrolledCount: number;
  modules: Module[];
  quiz?: Quiz;
  certificateAvailable: boolean;
  status: 'published' | 'draft';
  slug?: string;
  shortDescription?: string;
  fullDescription?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  originalPrice?: number;
  language?: string;
  instructor?: string;
  enrolledStudents?: number;
  outcomes?: string[];
  requirements?: string[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  modelEmbedUrl?: string;
  modelPath?: string;
}

export interface CourseEnrollment {
  courseId: string;
  enrolledAt: string;
  progress: number; // Percentage 0-100
  completedLessons: string[]; // List of lesson IDs
  completedQuizzes: { [quizId: string]: number }; // quizId -> score
  certificateId?: string;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  recipientId: string;
  recipientName: string;
  instructorName: string;
  issueDate: string;
  credentialId: string;
}

export interface AnalyticsSummary {
  totalCourses: number;
  totalStudents: number;
  totalInstructors: number;
  revenue: number;
  courseCompletionRate: number;
}

export interface InstructorApproval {
  id: string;
  name: string;
  email: string;
  bio: string;
  resumeUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
}

export interface CourseApproval {
  courseId: string;
  courseTitle: string;
  instructorName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}
