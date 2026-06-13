import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  BookOpen, Award, Clock, Flame, Play, AlertCircle, 
  User, Mail, CheckCircle2, ChevronRight, ArrowLeft, ArrowRight, Check
} from 'lucide-react';
import { 
  Button, Card, Badge, ProgressBar, StatsCard, EmptyState, 
  LoadingSkeleton, Input, Textarea, ToastNotification
} from '../components/ui';
import { LessonPlayer, LessonSidebar, QuizComponent, CertificateCard } from '../components/lms';
import { DashboardLayout, PageHeader } from '../components/layout';
import { FocusTogetherCard } from '../components/playhtml/FocusTogetherCard';
import { useAuth } from '../hooks/useAuth';
import { useProgress, useStudentCertificates } from '../hooks/useProgress';
import { useCourses } from '../hooks/useCourses';
import { mockApi } from '../lib/api';
import { Course, Lesson, Certificate } from '../types';

// ==========================================
// 1. STUDENT DASHBOARD
// ==========================================
export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolled, setEnrolled] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { courses } = useCourses();

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user) return;
      const data = await mockApi.getStudentEnrollments(user.id);
      setEnrolled(data);
      setLoading(false);
    };
    fetchDashboard();
  }, [user]);

  if (loading) return <DashboardLayout><LoadingSkeleton variant="card" count={3} /></DashboardLayout>;

  const continueCourse = enrolled.find(e => e.progress < 100) || enrolled[0];
  const completedCount = enrolled.filter(e => e.progress === 100).length;

  return (
    <DashboardLayout>
      <PageHeader 
        title={`Welcome back, ${user?.name}! 👋`} 
        description="Resume learning or check your certification records."
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Current Streak" value="12 Days" icon={<Flame className="h-5 w-5 text-amber-500 fill-amber-500" />} change="Daily goal active! 🔥" />
        <StatsCard title="Enrolled Modules" value={enrolled.length} icon={<BookOpen className="h-5 w-5" />} />
        <StatsCard title="Completed Guides" value={completedCount} icon={<CheckCircle2 className="h-5 w-5 text-success" />} />
        <StatsCard title="Earned Certs" value={completedCount} icon={<Award className="h-5 w-5 text-warning" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        {/* Continue Learning card */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-main">Resume Active Syllabus</h3>
          
          {continueCourse ? (
            <Card className="bg-surface border border-border flex flex-col md:flex-row gap-5 items-center p-6">
              <div className="w-full md:w-48 aspect-video rounded-card overflow-hidden bg-surface-muted border border-border/50 flex-shrink-0">
                <img src={continueCourse.course.thumbnail} alt={continueCourse.course.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow space-y-4 w-full text-left">
                <div>
                  <Badge variant="primary">{continueCourse.course.difficulty}</Badge>
                  <h4 className="text-base font-extrabold text-text-main mt-1.5 leading-snug">{continueCourse.course.title}</h4>
                </div>
                <ProgressBar progress={continueCourse.progress} />
                <Button onClick={() => navigate(`/course/${continueCourse.courseId}/learn`)}>
                  Open Syllabus Player
                </Button>
              </div>
            </Card>
          ) : (
            <EmptyState 
              title="Start learning" 
              description="Register in standard course guides inside the main catalog."
              action={<Button onClick={() => navigate('/courses')}>Catalog search</Button>}
            />
          )}

          {/* Enrolled grid list */}
          {enrolled.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-main">Registered syllabus</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {enrolled.map(item => (
                  <Card key={item.courseId} hoverable onClick={() => navigate(`/course/${item.courseId}/learn`)} className="bg-surface p-4 border text-left flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="aspect-video w-full rounded-ctrl overflow-hidden bg-surface-muted border border-border/40">
                        <img src={item.course.thumbnail} alt={item.course.title} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="text-sm font-extrabold text-text-main line-clamp-1">{item.course.title}</h4>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/50">
                      <ProgressBar progress={item.progress} />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar recommendations, quizzes and certificates */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-surface p-5 space-y-4 border border-border">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-text-main">Tutor Suggestions</h4>
            <div className="space-y-3">
              {courses.slice(2, 4).map(course => (
                <div key={course.id} onClick={() => navigate(`/course/${course.id}`)} className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-surface-muted rounded-ctrl">
                  <div className="h-10 w-10 bg-surface-muted border border-border/40 rounded-ctrl overflow-hidden flex-shrink-0">
                    <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="overflow-hidden text-left">
                    <h5 className="text-xs font-bold text-text-main truncate">{course.title}</h5>
                    <span className="text-[10px] text-text-subtle capitalize font-semibold">{course.difficulty} • {course.isFree ? 'Free' : 'Premium'}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Quizzes */}
          {enrolled.filter(e => {
            const hasQuiz = e.course?.quiz !== undefined;
            const isQuizDone = e.completedQuizzes && e.course?.quiz && e.completedQuizzes[e.course.quiz.id] !== undefined;
            return hasQuiz && !isQuizDone;
          }).length > 0 && (
            <Card className="bg-surface p-5 space-y-4 border border-border">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-text-main">Upcoming Quizzes</h4>
              <div className="space-y-3">
                {enrolled.filter(e => {
                  const hasQuiz = e.course?.quiz !== undefined;
                  const isQuizDone = e.completedQuizzes && e.course?.quiz && e.completedQuizzes[e.course.quiz.id] !== undefined;
                  return hasQuiz && !isQuizDone;
                }).map(e => (
                  <div key={e.courseId} onClick={() => navigate(`/course/${e.courseId}/learn`)} className="flex items-center justify-between p-2 hover:bg-surface-muted rounded-ctrl cursor-pointer border border-border/40 bg-surface-muted/30">
                    <div className="overflow-hidden text-left flex-1 mr-2">
                      <h5 className="text-xs font-bold text-text-main truncate">{e.course.quiz.title}</h5>
                      <span className="text-[10px] text-text-subtle font-semibold truncate block">{e.course.title}</span>
                    </div>
                    <Badge variant="primary" className="scale-90 flex-shrink-0">Take Quiz</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Certificates Widget */}
          <Card className="bg-surface p-5 space-y-4 border border-border">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-text-main">Certificates</h4>
              {enrolled.filter(e => e.progress === 100).length > 0 && (
                <Button variant="ghost" size="sm" className="p-0 h-auto text-[10px]" onClick={() => navigate('/student/certificates')}>View All</Button>
              )}
            </div>
            {enrolled.filter(e => e.progress === 100).length > 0 ? (
              <div className="space-y-3">
                {enrolled.filter(e => e.progress === 100).map(e => (
                  <div key={e.courseId} onClick={() => navigate('/student/certificates')} className="flex items-center gap-2.5 p-2 hover:bg-surface-muted rounded-ctrl cursor-pointer border border-border/40 bg-surface-muted/30">
                    <Award className="h-5 w-5 text-warning flex-shrink-0" />
                    <div className="overflow-hidden text-left">
                      <h5 className="text-xs font-bold text-text-main truncate">{e.course.title}</h5>
                      <span className="text-[10px] text-success font-semibold">100% Completed</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-text-subtle text-left">Complete a course to unlock certificates.</p>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ==========================================
// 2. MY COURSES PAGE
// ==========================================
export const MyCourses: React.FC = () => {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      const data = await mockApi.getStudentEnrollments(user.id);
      setEnrolled(data);
      setLoading(false);
    };
    fetchCourses();
  }, [user]);

  return (
    <DashboardLayout>
      <PageHeader title="My Enrolled Syllabus" description="Track progress or select modules to resume study." />

      {loading ? (
        <LoadingSkeleton variant="card" count={3} />
      ) : enrolled.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {enrolled.map(item => (
            <Card key={item.courseId} hoverable onClick={() => navigate(`/course/${item.courseId}/learn`)} className="flex flex-col justify-between h-full bg-surface border border-border">
              <div className="space-y-3">
                <div className="aspect-video w-full rounded-ctrl overflow-hidden bg-surface-muted border border-border/40">
                  <img src={item.course.thumbnail} alt={item.course.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <Badge variant="primary">{item.course.difficulty}</Badge>
                  <h4 className="text-sm font-extrabold text-text-main mt-1.5 leading-snug line-clamp-2">{item.course.title}</h4>
                  <span className="text-[10px] text-text-subtle font-extrabold uppercase tracking-wider block mt-1">Instructor: {item.course.instructorName}</span>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-border/50 space-y-4">
                <ProgressBar progress={item.progress} />
                <Button className="w-full">Resume Room</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No Active Enrollments" 
          description="Browse our syllabus catalog to sign up for classes."
          action={<Button onClick={() => navigate('/courses')}>Catalog Directory</Button>}
        />
      )}
    </DashboardLayout>
  );
};

// ==========================================
// 3. COURSE LEARNING PLAYER PAGE
// ==========================================
export const CourseLearningPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [quizSelected, setQuizSelected] = useState(false);
  const [loading, setLoading] = useState(true);

  const { enrollment, toggleLesson, submitQuizResult } = useProgress(course?.id, user?.id);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      const data = await mockApi.getCourseById(id);
      if (data) {
        setCourse(data);
        if (data.modules.length > 0 && data.modules[0].lessons.length > 0) {
          setActiveLesson(data.modules[0].lessons[0]);
        }
      }
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  if (loading) return <DashboardLayout><LoadingSkeleton variant="profile" /></DashboardLayout>;
  if (!course) return <DashboardLayout><EmptyState title="Error" description="Syllabus not found" /></DashboardLayout>;

  const allLessons: Lesson[] = [];
  course.modules.forEach(m => allLessons.push(...m.lessons));

  const currIdx = activeLesson ? allLessons.findIndex(l => l.id === activeLesson.id) : -1;
  const prevLesson = currIdx > 0 ? allLessons[currIdx - 1] : undefined;
  const nextLesson = currIdx !== -1 && currIdx < allLessons.length - 1 ? allLessons[currIdx + 1] : undefined;

  const handleToggleComplete = async () => {
    if (!activeLesson) return;
    const isCompleted = enrollment ? enrollment.completedLessons.includes(activeLesson.id) : false;
    await toggleLesson(activeLesson.id, !isCompleted);
  };

  const handleSelectQuiz = () => {
    setQuizSelected(true);
  };

  const handleQuizSubmit = async (score: number) => {
    if (!course.quiz) return;
    const res = await submitQuizResult(course.quiz.id, score);
    if (res) {
      navigate(`/course/${id}/quiz-result?score=${score}`);
    }
  };

  const isCompleted = (lessonId: string) => {
    return enrollment ? enrollment.completedLessons.includes(lessonId) : false;
  };

  const isQuizCompleted = enrollment && course.quiz ? enrollment.completedQuizzes[course.quiz.id] !== undefined : false;

  return (
    <DashboardLayout>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/student/my-courses')} icon={<ArrowLeft className="h-4 w-4" />}>
          Back to list
        </Button>
        <span className="text-xs font-bold text-text-subtle uppercase tracking-wider">{course.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Video Player or Quiz Component */}
        <div className="lg:col-span-8 space-y-6">
          {quizSelected && course.quiz ? (
            <div className="space-y-4">
              <Button variant="outline" size="sm" onClick={() => setQuizSelected(false)} icon={<ArrowLeft className="h-4 w-4" />}>
                Return to Video Lesson
              </Button>
              <QuizComponent 
                quiz={course.quiz} 
                onSubmit={handleQuizSubmit} 
              />
            </div>
          ) : activeLesson ? (
            <LessonPlayer 
              lesson={activeLesson}
              isCompleted={isCompleted(activeLesson.id)}
              onToggleComplete={handleToggleComplete}
              onPrev={prevLesson ? () => { setActiveLesson(prevLesson); setQuizSelected(false); } : undefined}
              onNext={nextLesson ? () => { setActiveLesson(nextLesson); setQuizSelected(false); } : undefined}
            />
          ) : (
            <EmptyState title="No active lesson" description="Please select a lesson from the syllabus sidebar." />
          )}
        </div>

        {/* Right Side: Syllabus Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <LessonSidebar 
            modules={course.modules}
            completedLessons={enrollment ? enrollment.completedLessons : []}
            activeLessonId={activeLesson?.id || ''}
            onSelectLesson={(les) => { setActiveLesson(les); setQuizSelected(false); }}
            onToggleComplete={async (lesId, checked) => {
              await toggleLesson(lesId, checked);
            }}
            quiz={course.quiz}
            quizCompleted={isQuizCompleted}
            onSelectQuiz={handleSelectQuiz}
            activeQuizSelected={quizSelected}
          />
          <FocusTogetherCard courseId={course.id} />
        </div>
      </div>
    </DashboardLayout>
  );
};

// ==========================================
// 4. QUIZ RESULT PAGE
// ==========================================
export const QuizResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const score = parseInt(params.get('score') || '0');
  const passed = score >= 70;

  return (
    <DashboardLayout>
      <PageHeader title="Quiz Result" description="Your multiple-choice score evaluation results." />

      <Card className="max-w-md mx-auto text-center p-8 bg-surface border border-border space-y-6">
        <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center text-[#111827] ${passed ? 'bg-success' : 'bg-danger'}`}>
          {passed ? <Check className="h-8 w-8 stroke-[3px]" /> : <AlertCircle className="h-8 w-8" />}
        </div>

        <div className="space-y-2">
          <Badge variant={passed ? 'success' : 'danger'}>
            {passed ? 'Passed - Qualified' : 'Failed - Try Again'}
          </Badge>
          <h2 className="text-3xl font-black text-text-main">Score: {score}%</h2>
          <p className="text-xs text-text-subtle font-semibold">Passing threshold: 70%</p>
        </div>

        <p className="text-xs text-text-muted leading-relaxed">
          {passed 
            ? 'Congratulations! You have successfully passed the final assessment. A printable completion certificate is now generated and logged in your panel.'
            : 'You scored below the passing threshold. Review lesson resources and try the syllabus test again.'
          }
        </p>

        <div className="flex gap-3 justify-center pt-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/course/${id}/learn`)}>
            Syllabus outline
          </Button>
          {!passed && (
            <Button size="sm" onClick={() => navigate(`/course/${id}/learn`)}>
              Retry Assessment
            </Button>
          )}
          {passed && (
            <Button variant="secondary" size="sm" onClick={() => navigate('/student/certificates')}>
              Open Certificate
            </Button>
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
};

// ==========================================
// 5. CERTIFICATES PAGE
// ==========================================
export const CertificatesPage: React.FC = () => {
  const { user } = useAuth();
  const { certificates, loading } = useStudentCertificates(user?.id);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <PageHeader title="My Earned Certificates" description="View or download printable credentials for completed course syllabus." />

      {selectedCert ? (
        <div className="space-y-4">
          <Button variant="outline" size="sm" onClick={() => setSelectedCert(null)} icon={<ArrowLeft className="h-4 w-4" />}>
            Back to certificates list
          </Button>
          <CertificateCard certificate={selectedCert} />
        </div>
      ) : loading ? (
        <LoadingSkeleton variant="table" count={3} />
      ) : certificates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {certificates.map(cert => (
            <Card key={cert.id} className="bg-surface border border-border p-5 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <Award className="h-10 w-10 text-warning" />
                <div>
                  <h4 className="text-sm font-extrabold text-text-main leading-snug line-clamp-2">{cert.courseTitle}</h4>
                  <span className="text-[10px] text-text-subtle font-semibold mt-1 block">Issued: {cert.issueDate}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-6 w-full" onClick={() => setSelectedCert(cert)}>
                View Certificate
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No Certificates Yet" 
          description="Complete all lessons and pass the final quiz to earn your credentials."
          action={<Button onClick={() => navigate('/student/dashboard')}>View Active Courses</Button>}
        />
      )}
    </DashboardLayout>
  );
};

// ==========================================
// 6. PROFILE PAGE
// ==========================================
export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolledCount, setEnrolledCount] = useState(0);

  useEffect(() => {
    if (user) {
      mockApi.getStudentEnrollments(user.id).then(res => setEnrolledCount(res.length));
    }
  }, [user]);

  if (!user) return null;

  return (
    <DashboardLayout>
      <PageHeader title="Student Profile" description="Your student details and timeline stats." />

      <Card className="max-w-2xl mx-auto p-6 bg-surface border border-border text-left space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-border">
          <img src={user.avatarUrl} alt={user.name} className="h-20 w-20 rounded-full object-cover border-2 border-secondary" />
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-lg font-black text-text-main leading-none">{user.name}</h3>
            <span className="text-xs text-text-muted block">{user.email}</span>
            <Badge variant="primary" className="capitalize">Role: {user.role}</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">Biography Details</h4>
          <p className="text-xs text-text-muted leading-relaxed">
            {user.bio || 'No profile biography specified.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-border pt-6 text-xs text-text-subtle font-bold uppercase tracking-wider">
          <div>
            <span>Enrolled Courses</span>
            <p className="text-xl font-black text-text-main mt-1">{enrolledCount}</p>
          </div>
          <div>
            <span>Joined Date</span>
            <p className="text-xl font-black text-text-main mt-1">{user.joinedDate}</p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => navigate('/student/settings')}>
            Modify Profile Settings
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
};

// ==========================================
// 7. SETTINGS PAGE
// ==========================================
export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [toast, setToast] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    updateUser({ ...user, name, bio });
    setToast('Settings successfully updated!');
  };

  return (
    <DashboardLayout>
      <div className="pb-6 border-b border-border mb-6 text-left">
        <h1 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight leading-none">
          Portal Settings
        </h1>
        <p className="text-sm text-text-muted mt-2 max-w-2xl leading-relaxed">
          Modify name and biography parameters in your student database.
        </p>
      </div>

      <Card className="max-w-xl mx-auto p-6 bg-surface border border-border text-left">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
          <Textarea 
            label="Biographical description" 
            value={bio} 
            onChange={e => setBio(e.target.value)} 
          />
          <div className="pt-4 flex justify-end">
            <Button type="submit">Save Settings Changes</Button>
          </div>
        </form>
      </Card>

      {toast && (
        <ToastNotification message={toast} onClose={() => setToast(null)} />
      )}
    </DashboardLayout>
  );
};
