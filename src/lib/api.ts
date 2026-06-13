import { Course, CourseEnrollment, Certificate, InstructorApproval, CourseApproval, User } from '../types';
import { 
  getCourses as getLocalCourses, setCourses, 
  getEnrollments, setEnrollments, 
  getCertificates as getLocalCertificates, setCertificates,
  getInstructorApprovals, setInstructorApprovals,
  getCourseApprovals, setCourseApprovals,
  getUsers as getLocalUsers, setUsers,
  getNotifications, setNotifications
} from './storage';
import { delay } from './auth';
import { safeRequest } from './apiClient';

// --- MOCK FALLBACK UTILS (Runs in DEV when server is offline) ---
const mockGetCourses = async (filters?: { category?: string; difficulty?: string; search?: string; instructorId?: string; priceType?: string }) => {
  await delay(200);
  let courses = getLocalCourses();
  if (filters?.instructorId) {
    courses = courses.filter(c => c.instructorId === filters.instructorId);
  } else {
    courses = courses.filter(c => c.status === 'published');
  }
  if (filters?.category) {
    courses = courses.filter(c => c.category.toLowerCase() === filters.category!.toLowerCase());
  }
  if (filters?.difficulty) {
    courses = courses.filter(c => c.difficulty.toLowerCase() === filters.difficulty!.toLowerCase());
  }
  if (filters?.priceType) {
    const type = filters.priceType.toLowerCase();
    if (type === 'free') {
      courses = courses.filter(c => c.isFree);
    } else if (type === 'paid') {
      courses = courses.filter(c => !c.isFree);
    }
  }
  if (filters?.search) {
    const query = filters.search.toLowerCase().trim();
    courses = courses.filter(c => 
      c.title.toLowerCase().includes(query) || 
      c.description.toLowerCase().includes(query) ||
      c.instructorName.toLowerCase().includes(query)
    );
  }
  return courses;
};

const mockGetCourseById = async (idOrSlug: string) => {
  await delay(100);
  const courses = getLocalCourses();
  return courses.find(c => c.id === idOrSlug || c.slug === idOrSlug) || null;
};

const mockCreateCourse = async (courseData: Partial<Course> & { title: string }, instructor: User) => {
  await delay(300);
  const courses = getLocalCourses();
  const newCourse: Course = {
    id: `course-${Math.random().toString(36).substr(2, 9)}`,
    title: courseData.title,
    thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    description: courseData.description || 'No description provided.',
    category: courseData.category || 'Web Development',
    difficulty: courseData.difficulty || 'Beginner',
    duration: courseData.duration || '2h 00m',
    isFree: courseData.isFree ?? true,
    price: courseData.isFree ? 0 : (courseData.price || 49.00),
    instructorName: instructor.name,
    instructorId: instructor.id,
    rating: 0,
    enrolledCount: 0,
    modules: courseData.modules || [],
    certificateAvailable: courseData.certificateAvailable ?? true,
    status: 'draft',
  };
  courses.push(newCourse);
  setCourses(courses);

  const approvals = getCourseApprovals();
  approvals.push({
    courseId: newCourse.id,
    courseTitle: newCourse.title,
    instructorName: instructor.name,
    status: 'pending',
    submittedAt: new Date().toISOString()
  });
  setCourseApprovals(approvals);
  return newCourse;
};

const mockUpdateCourse = async (id: string, updatedData: Partial<Course>) => {
  await delay(200);
  const courses = getLocalCourses();
  const index = courses.findIndex(c => c.id === id);
  if (index === -1) return null;
  const updatedCourse = { ...courses[index], ...updatedData };
  courses[index] = updatedCourse;
  setCourses(courses);
  return updatedCourse;
};

const mockEnrollInCourse = async (courseId: string, userId: string): Promise<CourseEnrollment> => {
  await delay(200);
  const enrollments = getEnrollments();
  const key = `${userId}_${courseId}`;
  if (enrollments[key]) return enrollments[key];

  const newEnrollment: CourseEnrollment = {
    courseId,
    enrolledAt: new Date().toISOString(),
    progress: 0,
    completedLessons: [],
    completedQuizzes: {},
  };
  enrollments[key] = newEnrollment;
  setEnrollments(enrollments);

  const courses = getLocalCourses();
  const courseIndex = courses.findIndex(c => c.id === courseId);
  if (courseIndex !== -1) {
    courses[courseIndex].enrolledCount += 1;
    setCourses(courses);
  }
  return newEnrollment;
};

const mockGetEnrollment = async (courseId: string, userId: string) => {
  await delay(100);
  const enrollments = getEnrollments();
  return enrollments[`${userId}_${courseId}`] || null;
};

const mockGetStudentEnrollments = async (userId: string) => {
  await delay(200);
  const enrollments = getEnrollments();
  const courses = getLocalCourses();
  return Object.entries(enrollments)
    .filter(([key]) => key.startsWith(`${userId}_`))
    .map(([_, enrollment]) => {
      const course = courses.find(c => c.id === enrollment.courseId)!;
      return { ...enrollment, course };
    })
    .filter(item => item.course !== undefined);
};

export const mockApi = {
  // --- COURSES ---
  async getCourses(filters?: { category?: string; difficulty?: string; search?: string; instructorId?: string; priceType?: string }): Promise<Course[]> {
    const query = new URLSearchParams();
    if (filters?.category) query.set('category', filters.category);
    if (filters?.difficulty) query.set('difficulty', filters.difficulty);
    if (filters?.search) query.set('search', filters.search);
    if (filters?.instructorId) query.set('instructorId', filters.instructorId);
    if (filters?.priceType) query.set('priceType', filters.priceType);

    return safeRequest<Course[]>(`/courses?${query.toString()}`, {
      method: 'GET',
    }, () => mockGetCourses(filters));
  },

  async getCourseById(idOrSlug: string): Promise<Course | null> {
    return safeRequest<Course | null>(`/courses/${idOrSlug}`, {
      method: 'GET',
    }, () => mockGetCourseById(idOrSlug));
  },

  async createCourse(courseData: Partial<Course> & { title: string }, instructor: User): Promise<Course> {
    return safeRequest<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }, () => mockCreateCourse(courseData, instructor));
  },

  async updateCourse(id: string, updatedData: Partial<Course>): Promise<Course | null> {
    return safeRequest<Course | null>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData),
    }, () => mockUpdateCourse(id, updatedData));
  },

  // --- STUDENT PROGRESS & ENROLLMENT ---
  async enrollInCourse(courseId: string, userId: string): Promise<CourseEnrollment> {
    return safeRequest<any>(`/enrollments/${courseId}`, {
      method: 'POST',
    }, () => mockEnrollInCourse(courseId, userId)).then(res => {
      // Map database schema response to CourseEnrollment type
      return {
        courseId: res.courseId?._id || res.courseId || courseId,
        enrolledAt: res.enrolledAt || res.createdAt,
        progress: res.progress || 0,
        completedLessons: res.completedLessons || [],
        completedQuizzes: res.completedQuizzes || {},
        certificateId: res.certificateId,
      };
    });
  },

  async getEnrollment(courseId: string, userId: string): Promise<CourseEnrollment | null> {
    return safeRequest<any>(`/enrollments/course/${courseId}`, {
      method: 'GET',
    }, () => mockGetEnrollment(courseId, userId)).then(res => {
      if (!res) return null;
      return {
        courseId: res.courseId?._id || res.courseId || courseId,
        enrolledAt: res.enrolledAt || res.createdAt,
        progress: res.progress || 0,
        completedLessons: res.completedLessons || [],
        completedQuizzes: res.completedQuizzes || {},
        certificateId: res.certificateId,
      };
    });
  },

  async getStudentEnrollments(userId: string): Promise<(CourseEnrollment & { course: Course })[]> {
    return safeRequest<any[]>('/enrollments/me', {
      method: 'GET',
    }, () => mockGetStudentEnrollments(userId)).then(res => {
      return res.map(e => ({
        courseId: e.courseId?._id || e.courseId,
        enrolledAt: e.enrolledAt || e.createdAt,
        progress: e.progress || 0,
        completedLessons: e.completedLessons || [],
        completedQuizzes: e.completedQuizzes || {},
        certificateId: e.certificateId,
        course: e.courseId || e.course,
      }));
    });
  },

  async updateLessonProgress(courseId: string, userId: string, lessonId: string, isCompleted: boolean): Promise<CourseEnrollment | null> {
    const action = isCompleted ? 'complete' : 'uncomplete';
    return safeRequest<any>(`/progress/${courseId}/lesson/${lessonId}/${action}`, {
      method: 'PATCH',
    }, async () => {
      // Fallback
      await delay(200);
      const enrollments = getEnrollments();
      const key = `${userId}_${courseId}`;
      const enrollment = enrollments[key];
      if (!enrollment) return null;

      let completed = [...enrollment.completedLessons];
      if (isCompleted) {
        if (!completed.includes(lessonId)) completed.push(lessonId);
      } else {
        completed = completed.filter(id => id !== lessonId);
      }

      const course = getLocalCourses().find(c => c.id === courseId);
      if (!course) return null;

      const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
      const totalItems = totalLessons + (course.quiz ? 1 : 0);
      const quizCompletedCount = Object.keys(enrollment.completedQuizzes).length;
      const completedItems = completed.length + quizCompletedCount;
      const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 100;

      enrollment.completedLessons = completed;
      enrollment.progress = progress;
      enrollments[key] = enrollment;
      setEnrollments(enrollments);
      return enrollment;
    }).then(res => {
      if (!res) return null;
      return {
        courseId: res.courseId?._id || res.courseId || courseId,
        enrolledAt: res.enrolledAt || res.createdAt,
        progress: res.progress || 0,
        completedLessons: res.completedLessons || [],
        completedQuizzes: res.completedQuizzes || {},
        certificateId: res.certificateId,
      };
    });
  },

  async submitQuizScore(courseId: string, userId: string, quizId: string, score: number): Promise<{ enrollment: CourseEnrollment; passed: boolean }> {
    return safeRequest<{ score: number; passed: boolean }>(`/quizzes/${courseId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ score }),
    }, async () => {
      // Fallback
      await delay(200);
      const enrollments = getEnrollments();
      const key = `${userId}_${courseId}`;
      const enrollment = enrollments[key];
      if (!enrollment) throw new Error('Student not enrolled in course');

      const course = getLocalCourses().find(c => c.id === courseId);
      if (!course || !course.quiz) throw new Error('Course or quiz not found');

      const passed = score >= course.quiz.passingScore;
      enrollment.completedQuizzes[quizId] = score;

      const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
      const totalItems = totalLessons + 1;
      const completedItems = enrollment.completedLessons.length + 1;
      const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 100;
      enrollment.progress = progress;

      enrollments[key] = enrollment;
      setEnrollments(enrollments);
      return { score, passed };
    }).then(async (res) => {
      // Refetch enrollment state to return fully updated structure
      const updatedEnrollment = await this.getEnrollment(courseId, userId);
      return {
        enrollment: updatedEnrollment!,
        passed: res.passed,
      };
    });
  },

  async getCertificates(userId: string): Promise<Certificate[]> {
    return safeRequest<Certificate[]>('/certificates/me', {
      method: 'GET',
    }, async () => {
      return getLocalCertificates().filter(c => c.recipientId === userId);
    });
  },

  // --- PLATFORM / ADMIN MANAGEMENT ---
  async getInstructorApprovals(): Promise<InstructorApproval[]> {
    return safeRequest<InstructorApproval[]>('/users/instructor-approvals', {
      method: 'GET',
    }, async () => {
      return getInstructorApprovals();
    }).catch(() => getInstructorApprovals()); // Fallback automatically if API not built yet
  },

  async submitInstructorRequest(data: { name: string; email: string; bio: string; resumeUrl: string }): Promise<InstructorApproval> {
    return safeRequest<InstructorApproval>('/users/instructor-request', {
      method: 'POST',
      body: JSON.stringify(data),
    }, async () => {
      await delay(400);
      const approvals = getInstructorApprovals();
      const newRequest: InstructorApproval = {
        id: `appr-${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        email: data.email,
        bio: data.bio,
        resumeUrl: data.resumeUrl,
        status: 'pending',
        requestedAt: new Date().toISOString()
      };
      approvals.push(newRequest);
      setInstructorApprovals(approvals);
      return newRequest;
    }).catch(async () => {
      // Fallback
      const approvals = getInstructorApprovals();
      const newRequest: InstructorApproval = {
        id: `appr-${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        email: data.email,
        bio: data.bio,
        resumeUrl: data.resumeUrl,
        status: 'pending',
        requestedAt: new Date().toISOString()
      };
      approvals.push(newRequest);
      setInstructorApprovals(approvals);
      return newRequest;
    });
  },

  async approveInstructor(id: string, action: 'approved' | 'rejected'): Promise<void> {
    return safeRequest<void>(`/users/instructor-approvals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: action }),
    }, async () => {
      await delay(200);
      const approvals = getInstructorApprovals();
      const index = approvals.findIndex(a => a.id === id);
      if (index === -1) return;
      approvals[index].status = action;
      setInstructorApprovals(approvals);
    }).catch(async () => {
      const approvals = getInstructorApprovals();
      const index = approvals.findIndex(a => a.id === id);
      if (index !== -1) {
        approvals[index].status = action;
        setInstructorApprovals(approvals);
      }
    });
  },

  async getCourseApprovals(): Promise<CourseApproval[]> {
    return safeRequest<CourseApproval[]>('/courses/approvals', {
      method: 'GET',
    }, async () => {
      return getCourseApprovals();
    }).catch(() => getCourseApprovals());
  },

  async approveCourse(courseId: string, action: 'approved' | 'rejected'): Promise<void> {
    return safeRequest<void>(`/courses/${courseId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: action === 'approved' ? 'published' : 'draft' }),
    }, async () => {
      await delay(200);
      const approvals = getCourseApprovals();
      const index = approvals.findIndex(a => a.courseId === courseId);
      if (index === -1) return;
      approvals[index].status = action;
      setCourseApprovals(approvals);
    }).catch(async () => {
      const approvals = getCourseApprovals();
      const index = approvals.findIndex(a => a.courseId === courseId);
      if (index !== -1) {
        approvals[index].status = action;
        setCourseApprovals(approvals);
      }
    });
  },

  async getUsersList(): Promise<User[]> {
    return safeRequest<User[]>('/users', {
      method: 'GET',
    }, async () => {
      return getLocalUsers();
    });
  },

  async updateUserRole(userId: string, role: 'student' | 'instructor' | 'admin'): Promise<void> {
    return safeRequest<void>(`/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }, async () => {
      await delay(200);
      const users = getLocalUsers();
      const index = users.findIndex(u => u.id === userId);
      if (index !== -1) {
        users[index].role = role;
        setUsers(users);
      }
    });
  }
};
