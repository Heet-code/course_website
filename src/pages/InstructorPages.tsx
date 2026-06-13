import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Users, DollarSign, Award, Plus, Trash2, Edit2, Play, Star
} from 'lucide-react';
import { 
  Button, Card, Badge, StatsCard, Table, EmptyState, 
  LoadingSkeleton, Input, Textarea, ToastNotification
} from '../components/ui';
import { CourseBuilder } from '../components/lms';
import { DashboardLayout, PageHeader } from '../components/layout';
import { useAuth } from '../hooks/useAuth';
import { mockApi } from '../lib/api';
import { mockInstructorStats } from '../data/mockData';
import { Course } from '../types';

// ==========================================
// 1. INSTRUCTOR DASHBOARD
// ==========================================
export const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      if (!user) return;
      const data = await mockApi.getCourses({ instructorId: user.id });
      setCourses(data);
      setLoading(false);
    };
    loadCourses();
  }, [user]);

  if (loading) return <DashboardLayout><LoadingSkeleton variant="card" count={3} /></DashboardLayout>;

  const totalStudents = courses.reduce((sum, c) => sum + c.enrolledCount, 0);
  const publishedCount = courses.filter(c => c.status === 'published').length;
  const draftCount = courses.filter(c => c.status === 'draft').length;

  return (
    <DashboardLayout>
      <PageHeader 
        title="Instructor Dashboard" 
        description="Monitor course syllabus creations, student signups, and reviews."
        action={
          <Button variant="primary" onClick={() => navigate('/instructor/create-course')} icon={<Plus className="h-4.5 w-4.5" />}>
            Create New Course
          </Button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Courses" value={courses.length} icon={<BookOpen className="h-5 w-5" />} change={`${publishedCount} published • ${draftCount} drafts`} />
        <StatsCard title="Total Students" value={totalStudents} icon={<Users className="h-5 w-5" />} />
        <StatsCard title="Avg Rating" value="4.7" icon={<Award className="h-5 w-5 text-warning" />} />
        <StatsCard title="Revenue (LTD)" value={`$${mockInstructorStats.revenue.toFixed(2)}`} icon={<DollarSign className="h-5 w-5 text-success" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        {/* Course performance table */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-main">Syllabus Performance</h3>
          
          <Table 
            data={courses}
            columns={[
              {
                header: 'Course Title',
                accessor: (c) => (
                  <span className="font-bold block truncate max-w-xs">{c.title}</span>
                )
              },
              {
                header: 'Enrolled',
                accessor: (c) => <span>{c.enrolledCount} Students</span>
              },
              {
                header: 'Difficulty',
                accessor: (c) => <Badge variant={c.difficulty === 'Advanced' ? 'danger' : 'secondary'}>{c.difficulty}</Badge>
              },
              {
                header: 'Status',
                accessor: (c) => (
                  <Badge variant={c.status === 'published' ? 'success' : 'neutral'}>
                    {c.status}
                  </Badge>
                )
              },
              {
                header: 'Action',
                accessor: (c) => (
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/instructor/edit-course?courseId=${c.id}`)}>
                    Edit Syllabus
                  </Button>
                )
              }
            ]}
          />
        </div>

        {/* Recent enrollments */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-main">Recent Enrollments</h3>
          
          <Card className="bg-surface border border-border p-4 space-y-3">
            {mockInstructorStats.recentEnrollments.map((enr) => (
              <div key={enr.id} className="p-2 border-b border-border/50 last:border-b-0 space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-text-main">
                  <span>{enr.name}</span>
                  <span className="text-[10px] text-text-subtle font-normal">{enr.enrolledAt}</span>
                </div>
                <p className="text-[10px] text-text-muted truncate">registered in "{enr.courseName}"</p>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ==========================================
// 2. MY COURSES PAGE
// ==========================================
export const InstructorCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      if (!user) return;
      const data = await mockApi.getCourses({ instructorId: user.id });
      setCourses(data);
      setLoading(false);
    };
    loadCourses();
  }, [user]);

  return (
    <DashboardLayout>
      <PageHeader 
        title="My Syllabus Catalog" 
        description="Review drafts and published technical guides."
        action={
          <Button onClick={() => navigate('/instructor/create-course')} icon={<Plus className="h-4 w-4" />}>
            Create Course
          </Button>
        }
      />

      {loading ? (
        <LoadingSkeleton variant="card" count={3} />
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {courses.map(course => (
            <Card key={course.id} className="flex flex-col justify-between h-full bg-surface border border-border p-5">
              <div className="space-y-3">
                <div className="aspect-video w-full rounded-ctrl overflow-hidden bg-surface-muted border border-border/40">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex gap-1.5">
                    <Badge variant={course.status === 'published' ? 'success' : 'neutral'}>{course.status}</Badge>
                    <Badge variant="primary">{course.difficulty}</Badge>
                  </div>
                  <h4 className="text-sm font-extrabold text-text-main mt-2 leading-snug line-clamp-2">{course.title}</h4>
                  <span className="text-[10px] text-text-subtle mt-1.5 block font-bold">{course.enrolledCount} enrolled students</span>
                </div>
              </div>
              
              <div className="mt-6 pt-3 border-t border-border/55 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => navigate(`/instructor/edit-course?courseId=${course.id}`)}>
                  Edit Syllabus
                </Button>
                {course.status === 'published' && (
                  <Button variant="ghost" onClick={() => navigate(`/course/${course.id}`)}>
                    Preview
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No Courses Drafted" 
          description="Draft your first course syllabus using our editor tools."
          action={<Button onClick={() => navigate('/instructor/create-course')}>Create Course</Button>}
        />
      )}
    </DashboardLayout>
  );
};

// ==========================================
// 3. CREATE / EDIT COURSE PAGE
// ==========================================
export const CreateCoursePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('courseId');

  useEffect(() => {
    const initCourse = async () => {
      if (courseId) {
        const existing = await mockApi.getCourseById(courseId);
        if (existing) {
          setCourse(existing);
        }
      } else {
        setCourse({
          id: '',
          title: 'Draft Course Title',
          thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
          description: 'Type course overview...',
          category: 'Web Development',
          difficulty: 'Beginner',
          duration: '3h 30m',
          isFree: true,
          price: 0,
          instructorName: user?.name || 'Instructor',
          instructorId: user?.id || 'user-instructor',
          rating: 0,
          enrolledCount: 0,
          modules: [],
          certificateAvailable: true,
          status: 'draft'
        });
      }
      setLoading(false);
    };
    initCourse();
  }, [courseId, user]);

  const handleSaveCourse = async (savedCourse: Course) => {
    if (!user) return;
    if (courseId) {
      const res = await mockApi.updateCourse(courseId, savedCourse);
      if (res) {
        setToast('Course syllabus changes successfully updated!');
        setTimeout(() => navigate('/instructor/courses'), 1500);
      }
    } else {
      const res = await mockApi.createCourse(savedCourse, user);
      if (res) {
        setToast('New course draft successfully created & submitted for approval!');
        setTimeout(() => navigate('/instructor/courses'), 1500);
      }
    }
  };

  if (loading) return <DashboardLayout><LoadingSkeleton variant="profile" /></DashboardLayout>;
  if (!course) return <DashboardLayout><EmptyState title="Error" description="Failed to initialize course builder." /></DashboardLayout>;

  return (
    <DashboardLayout>
      <PageHeader 
        title={courseId ? 'Edit Course Syllabus' : 'Create New Course'} 
        description="Draft course info, modules, lessons, and submit validation requests." 
      />

      <CourseBuilder initialCourse={course} onSave={handleSaveCourse} />

      {toast && (
        <ToastNotification message={toast} onClose={() => setToast(null)} />
      )}
    </DashboardLayout>
  );
};

// ==========================================
// 4. ENROLLED STUDENTS PAGE
// ==========================================
export const EnrolledStudentsPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      if (!user) return;
      const data = await mockApi.getCourses({ instructorId: user.id });
      setCourses(data);
      setLoading(false);
    };
    loadCourses();
  }, [user]);

  const registries = mockInstructorStats.recentEnrollments;

  return (
    <DashboardLayout>
      <PageHeader title="Enrolled Students" description="Review students actively registered in your course modules." />

      {loading ? (
        <LoadingSkeleton variant="table" count={3} />
      ) : registries.length > 0 ? (
        <Table 
          data={registries}
          columns={[
            {
              header: 'Student Name',
              accessor: (r) => (
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-secondary text-[#111827] font-bold flex items-center justify-center text-xs">
                    {r.name[0]}
                  </div>
                  <span className="font-bold text-text-main">{r.name}</span>
                </div>
              )
            },
            {
              header: 'Registered Course',
              accessor: (r) => <span className="font-medium text-text-muted">{r.courseName}</span>
            },
            {
              header: 'Enrollment Date',
              accessor: (r) => <span className="text-text-subtle">{r.enrolledAt}</span>
            },
            {
              header: 'Status',
              accessor: () => <Badge variant="success">Active</Badge>
            }
          ]}
        />
      ) : (
        <EmptyState title="No registrations" description="No student has registered in your courses yet." />
      )}
    </DashboardLayout>
  );
};

// ==========================================
// 5. INSTRUCTOR ANALYTICS
// ==========================================
export const AnalyticsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Course Analytics" description="Study student performance graphs, ratings, and course revenues." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <Card className="bg-surface border border-border p-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">Active Enrollments Breakdown</h4>
          <Table 
            data={mockInstructorStats.coursePerformance}
            columns={[
              {
                header: 'Course',
                accessor: (c) => <span className="font-bold block truncate max-w-xs">{c.title}</span>
              },
              {
                header: 'Registrations',
                accessor: (c) => <span className="text-text-muted">{c.enrollments}</span>
              },
              {
                header: 'Revenue',
                accessor: (c) => <span className="font-bold text-success">${c.revenue}</span>
              }
            ]}
          />
        </Card>

        <Card className="bg-surface border border-border p-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">Student Review Ratings</h4>
          <Table 
            data={mockInstructorStats.coursePerformance}
            columns={[
              {
                header: 'Course',
                accessor: (c) => <span className="font-bold block truncate max-w-xs">{c.title}</span>
              },
              {
                header: 'Average rating',
                accessor: (c) => (
                  <span className="flex items-center gap-1.5 font-bold text-text-main">
                    <Star className="h-4.5 w-4.5 text-warning fill-warning" /> {c.rating}
                  </span>
                )
              }
            ]}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};
