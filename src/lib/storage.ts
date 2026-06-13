import { Course, User, CourseEnrollment, Certificate, InstructorApproval, CourseApproval } from '../types';
import { mockCourses, mockUsers, mockCertificates, mockInstructorApprovals, mockCourseApprovals, mockNotifications } from '../data/mockData';

// Storage keys
const KEYS = {
  USER_SESSION: 'lms_session',
  USERS: 'lms_users',
  COURSES: 'lms_courses',
  ENROLLMENTS: 'lms_enrollments',
  CERTIFICATES: 'lms_certificates',
  INSTRUCTOR_APPROVALS: 'lms_instructor_approvals',
  COURSE_APPROVALS: 'lms_course_approvals',
  NOTIFICATIONS: 'lms_notifications',
};

// Initialize localStorage with mock data if empty
export const initializeStorage = (): void => {
  const storedCourses = localStorage.getItem(KEYS.COURSES);
  // Force reset if storage is empty or holds the legacy courses dataset
  const needsMigration = !storedCourses || storedCourses.includes('course-react-nextjs') || !storedCourses.includes('course-langchain-llamaindex');

  if (needsMigration) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(mockUsers));
    localStorage.setItem(KEYS.COURSES, JSON.stringify(mockCourses));
    localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(mockCertificates));
    localStorage.setItem(KEYS.INSTRUCTOR_APPROVALS, JSON.stringify(mockInstructorApprovals));
    localStorage.setItem(KEYS.COURSE_APPROVALS, JSON.stringify(mockCourseApprovals));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(mockNotifications));
    
    // Set initial student enrollments for Edrilla courses
    const initialEnrollment: { [key: string]: CourseEnrollment } = {
      'user-student_course-ai-builder': {
        courseId: 'course-ai-builder',
        enrolledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 20, // 2 completed out of 10 items total
        completedLessons: ['ai-m1-l1', 'ai-m1-l2'],
        completedQuizzes: {},
      },
      'user-student_course-mvp-engineering': {
        courseId: 'course-mvp-engineering',
        enrolledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 40,
        completedLessons: ['mvp-m1-l1', 'mvp-m1-l2'],
        completedQuizzes: {},
      }
    };
    localStorage.setItem(KEYS.ENROLLMENTS, JSON.stringify(initialEnrollment));
  } else {
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(mockUsers));
    }
    if (!localStorage.getItem(KEYS.CERTIFICATES)) {
      localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(mockCertificates));
    }
    if (!localStorage.getItem(KEYS.INSTRUCTOR_APPROVALS)) {
      localStorage.setItem(KEYS.INSTRUCTOR_APPROVALS, JSON.stringify(mockInstructorApprovals));
    }
    if (!localStorage.getItem(KEYS.COURSE_APPROVALS)) {
      localStorage.setItem(KEYS.COURSE_APPROVALS, JSON.stringify(mockCourseApprovals));
    }
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(mockNotifications));
    }
    if (!localStorage.getItem(KEYS.ENROLLMENTS)) {
      localStorage.setItem(KEYS.ENROLLMENTS, JSON.stringify({}));
    }
  }
};

// Generic read/write helpers
export const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error);
    return defaultValue;
  }
};

export const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing key "${key}" to localStorage:`, error);
  }
};

// Typed getters/setters
export const getSession = (): User | null => getItem<User | null>(KEYS.USER_SESSION, null);
export const setSession = (user: User | null) => setItem<User | null>(KEYS.USER_SESSION, user);

export const getUsers = (): User[] => getItem<User[]>(KEYS.USERS, []);
export const setUsers = (users: User[]) => setItem<User[]>(KEYS.USERS, users);

export const getCourses = (): Course[] => getItem<Course[]>(KEYS.COURSES, []);
export const setCourses = (courses: Course[]) => setItem<Course[]>(KEYS.COURSES, courses);

export const getEnrollments = (): { [key: string]: CourseEnrollment } => 
  getItem<{ [key: string]: CourseEnrollment }>(KEYS.ENROLLMENTS, {});
export const setEnrollments = (enrollments: { [key: string]: CourseEnrollment }) => 
  setItem<{ [key: string]: CourseEnrollment }>(KEYS.ENROLLMENTS, enrollments);

export const getCertificates = (): Certificate[] => getItem<Certificate[]>(KEYS.CERTIFICATES, []);
export const setCertificates = (certificates: Certificate[]) => setItem<Certificate[]>(KEYS.CERTIFICATES, certificates);

export const getInstructorApprovals = (): InstructorApproval[] => getItem<InstructorApproval[]>(KEYS.INSTRUCTOR_APPROVALS, []);
export const setInstructorApprovals = (approvals: InstructorApproval[]) => setItem<InstructorApproval[]>(KEYS.INSTRUCTOR_APPROVALS, approvals);

export const getCourseApprovals = (): CourseApproval[] => getItem<CourseApproval[]>(KEYS.COURSE_APPROVALS, []);
export const setCourseApprovals = (approvals: CourseApproval[]) => setItem<CourseApproval[]>(KEYS.COURSE_APPROVALS, approvals);

export const getNotifications = () => getItem<any[]>(KEYS.NOTIFICATIONS, []);
export const setNotifications = (notifs: any[]) => setItem<any[]>(KEYS.NOTIFICATIONS, notifs);
