import { Course, User, Certificate, InstructorApproval, CourseApproval } from '../types';
import { edrillaCourses } from './courses';

export const mockUsers: User[] = [
  {
    id: 'user-student',
    name: 'Sarah Connor',
    email: 'student@thelearningcollective.com',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    joinedDate: 'Jan 10, 2026',
    bio: 'Avid learner looking to pivot my career into AI building and MVP engineering.'
  },
  {
    id: 'user-instructor',
    name: 'Dr. Evelyn Sterling',
    email: 'instructor@thelearningcollective.com',
    role: 'instructor',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    title: 'Principal Software Architect & Educator',
    joinedDate: 'Aug 15, 2024',
    bio: 'Over 15 years of industry experience building scalable distributed systems and training thousands of engineers worldwide.'
  },
  {
    id: 'user-admin',
    name: 'Marcus Vance',
    email: 'admin@thelearningcollective.com',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150',
    joinedDate: 'Mar 01, 2023',
    bio: 'Lead Platform Administrator for The Learning Collective.'
  }
];

export const mockCategories = [
  { id: 'cat-ai', name: 'AI', icon: 'Zap', count: 1 },
  { id: 'cat-engineering', name: 'Engineering', icon: 'Code', count: 1 },
  { id: 'cat-business', name: 'Business', icon: 'TrendingUp', count: 3 },
  { id: 'cat-productivity', name: 'Productivity', icon: 'Clock', count: 1 }
];

// Reference the central courses database
export const mockCourses: Course[] = edrillaCourses;

export const mockCertificates: Certificate[] = [
  {
    id: 'cert-1',
    courseId: 'course-ai-builder',
    courseTitle: 'Become An AI Builder In 30 Days',
    recipientId: 'user-student',
    recipientName: 'Sarah Connor',
    instructorName: 'Dr. Evelyn Sterling',
    recipientAvatarUrl: '',
    issueDate: 'May 12, 2026',
    credentialId: 'TLC-CERT-AI-1029410'
  }
];

export const mockInstructorApprovals: InstructorApproval[] = [
  {
    id: 'appr-1',
    name: 'Jane Doe',
    email: 'jane.doe@maths.edu',
    bio: 'Associate Professor of Computational Mathematics with 8 years online tutoring experience.',
    resumeUrl: 'jane-doe-resume.pdf',
    status: 'pending',
    requestedAt: '2026-06-05T10:15:30.000Z'
  },
  {
    id: 'appr-2',
    name: 'Robert C. Martin',
    email: 'clean.coder@agile.org',
    bio: 'Author of Clean Code and agile pioneer. Looking to publish software craft courses.',
    resumeUrl: 'bob-martin-cv.pdf',
    status: 'pending',
    requestedAt: '2026-06-08T14:20:00.000Z'
  },
  {
    id: 'appr-3',
    name: 'Alex Rivera',
    email: 'alex.rivera@dev.io',
    bio: 'Fullstack Dev. Wants to teach Docker and Kubernetes workflows.',
    resumeUrl: 'rivera-resume.pdf',
    status: 'approved',
    requestedAt: '2026-05-20T08:00:00.000Z'
  }
];

export const mockCourseApprovals: CourseApproval[] = [
  {
    courseId: 'course-draft-demo',
    courseTitle: 'SaaS Analytics and Growth',
    instructorName: 'Dr. Evelyn Sterling',
    status: 'pending',
    submittedAt: '2026-06-10T11:45:00.000Z'
  }
];

export const mockNotifications = [
  {
    id: 'notif-1',
    title: 'Welcome to The Learning Collective!',
    message: 'Explore the bento course catalog and start your learning journey.',
    time: '2 hours ago',
    read: false
  },
  {
    id: 'notif-2',
    title: 'New Course Available',
    message: 'Dr. Evelyn Sterling has published Become An AI Builder In 30 Days.',
    time: '1 day ago',
    read: true
  }
];

export const mockAdminStats = {
  totalUsers: 4520,
  totalStudents: 4400,
  totalInstructors: 118,
  totalCourses: 11,
  pendingApprovals: 3,
  monthlyRevenue: 12450.00,
  courseCompletions: 342,
  userGrowth: [
    { name: 'Jan', students: 3100, instructors: 90 },
    { name: 'Feb', students: 3400, instructors: 98 },
    { name: 'Mar', students: 3800, instructors: 105 },
    { name: 'Apr', students: 4000, instructors: 110 },
    { name: 'May', students: 4250, instructors: 114 },
    { name: 'Jun', students: 4400, instructors: 118 }
  ],
  revenueGrowth: [
    { name: 'Jan', amount: 8400 },
    { name: 'Feb', amount: 9800 },
    { name: 'Mar', amount: 11000 },
    { name: 'Apr', amount: 10500 },
    { name: 'May', amount: 11800 },
    { name: 'Jun', amount: 12450 }
  ]
};

export const mockInstructorStats = {
  totalCourses: 10,
  totalStudents: 12690,
  courseCompletionRate: 64, // 64%
  revenue: 11430.00,
  recentEnrollments: [
    { id: 're-1', name: 'Sarah Connor', courseName: 'Become An AI Builder In 30 Days', enrolledAt: '2 hours ago' },
    { id: 're-2', name: 'John Connor', courseName: 'MVP Engineering', enrolledAt: '4 hours ago' },
    { id: 're-3', name: 'Kyle Reese', courseName: 'Solopreneur - Solo Agency Masterclass', enrolledAt: '1 day ago' },
    { id: 're-4', name: 'Miles Dyson', courseName: 'The Art Of Content Creation', enrolledAt: '2 days ago' }
  ],
  coursePerformance: [
    { id: 'course-ai-builder', title: 'Become An AI Builder In 30 Days', enrollments: 1540, revenue: 4500, rating: 4.8 },
    { id: 'course-mvp-engineering', title: 'MVP Engineering', enrollments: 980, revenue: 3200, rating: 4.9 },
    { id: 'course-solopreneur', title: 'Solopreneur', enrollments: 840, revenue: 1230, rating: 4.9 },
    { id: 'course-vibe-marketing', title: 'Vibe Marketing', enrollments: 1200, revenue: 0, rating: 4.5 },
    { id: 'course-ai-agent-architect', title: 'AI Agent Architect', enrollments: 820, revenue: 2500, rating: 4.8 },
    { id: 'course-prompt-masterclass', title: 'Prompt Engineering Masterclass', enrollments: 2540, revenue: 0, rating: 4.7 },
    { id: 'course-langchain-llamaindex', title: 'LangChain & LlamaIndex: LLM App Development', enrollments: 640, revenue: 2500, rating: 4.9 },
    { id: 'course-finetuning-llms', title: 'Fine-Tuning LLMs: Custom Model Training', enrollments: 380, revenue: 1800, rating: 4.9 }
  ]
};

export const mockTestimonials = [
  {
    name: 'Amelia Chen',
    role: 'Frontend Engineer at Stripe',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    content: 'The bento grid UI makes tracking my progress and switching between resources so smooth. Becoming an AI builder transformed how I ship features!'
  },
  {
    name: 'David Miller',
    role: 'SaaS Founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    content: 'MVP Engineering gave me the perfect technical tools to construct my first product without hiring an expensive agency. Truly life changing!'
  },
  {
    name: 'Jessica Taylor',
    role: 'Product Designer',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120',
    content: 'The Solopreneur course gave me a concrete blueprint to turn my freelance design services into high-value productized retainers. Highly recommended.'
  }
];
