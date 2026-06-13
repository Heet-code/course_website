import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, BookOpen, ShieldCheck, DollarSign, Award, AlertCircle
} from 'lucide-react';
import { 
  Button, Card, Badge, StatsCard, Table, EmptyState, 
  LoadingSkeleton, Input, Select, ToastNotification
} from '../components/ui';
import { DashboardLayout, PageHeader } from '../components/layout';
import { mockApi } from '../lib/api';
import { mockAdminStats } from '../data/mockData';
import { User, Course, InstructorApproval, CourseApproval } from '../types';

// ==========================================
// 1. ADMIN DASHBOARD
// ==========================================
export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [instApps, setInstApps] = useState<InstructorApproval[]>([]);
  const [courseApps, setCourseApps] = useState<CourseApproval[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    const u = await mockApi.getUsersList();
    const c = await mockApi.getCourses({ instructorId: '' });
    const ia = await mockApi.getInstructorApprovals();
    const ca = await mockApi.getCourseApprovals();

    setUsers(u);
    setCourses(c);
    setInstApps(ia.filter(a => a.status === 'pending'));
    setCourseApps(ca.filter(a => a.status === 'pending'));
    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <DashboardLayout><LoadingSkeleton variant="table" count={3} /></DashboardLayout>;

  const studentsCount = users.filter(u => u.role === 'student').length;
  const instructorsCount = users.filter(u => u.role === 'instructor').length;

  return (
    <DashboardLayout>
      <PageHeader title="Platform Administration" description="Monitor student signups, instructor approvals, and course creations." />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Users" value={users.length} icon={<Users className="h-5 w-5" />} change={`${studentsCount} students • ${instructorsCount} teachers`} />
        <StatsCard title="Total Courses" value={courses.length} icon={<BookOpen className="h-5 w-5" />} />
        <StatsCard title="Pending Approvals" value={instApps.length + courseApps.length} icon={<ShieldCheck className="h-5 w-5" />} />
        <StatsCard title="Monthly Revenue" value={`$${mockAdminStats.monthlyRevenue.toFixed(2)}`} icon={<DollarSign className="h-5 w-5 text-success" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        {/* Instructor applications queue */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-main">Instructor Approval Requests</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/approvals')}>View All</Button>
          </div>

          <Card className="bg-surface border border-border p-4 space-y-4">
            {instApps.length > 0 ? (
              instApps.map((app) => (
                <div key={app.id} className="p-3 border border-border rounded-card bg-surface-muted flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1.5 overflow-hidden">
                    <span className="font-bold text-text-main block">{app.name}</span>
                    <span className="text-text-muted block">{app.email}</span>
                    <p className="text-[10px] text-text-subtle italic line-clamp-2 mt-1">"{app.bio}"</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/admin/approvals')}>Review</Button>
                </div>
              ))
            ) : (
              <p className="text-xs text-text-subtle text-center py-4">No pending instructor requests</p>
            )}
          </Card>
        </div>

        {/* Course approval queue */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-main">Course Syllabus Requests</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/courses')}>View All</Button>
          </div>

          <Card className="bg-surface border border-border p-4 space-y-4">
            {courseApps.length > 0 ? (
              courseApps.map((app, idx) => (
                <div key={idx} className="p-3 border border-border rounded-card bg-surface-muted flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1.5 overflow-hidden">
                    <span className="font-bold text-text-main block truncate">{app.courseTitle}</span>
                    <span className="text-[10px] text-text-muted block">Submitted by {app.instructorName}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/admin/courses')}>Review</Button>
                </div>
              ))
            ) : (
              <p className="text-xs text-text-subtle text-center py-4">No pending course approval requests</p>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ==========================================
// 2. USER MANAGEMENT PAGE
// ==========================================
export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const loadUsers = async () => {
    const data = await mockApi.getUsersList();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, role: 'student' | 'instructor' | 'admin') => {
    await mockApi.updateUserRole(userId, role);
    setToast(`User role successfully changed to ${role}!`);
    loadUsers();
  };

  return (
    <DashboardLayout>
      <PageHeader title="User Management" description="Promote credentials and review platform user accounts." />

      {loading ? (
        <LoadingSkeleton variant="table" count={3} />
      ) : (
        <Table 
          data={users}
          columns={[
            {
              header: 'User Details',
              accessor: (u) => (
                <div>
                  <span className="font-bold text-text-main block">{u.name}</span>
                  <span className="text-xs text-text-muted">{u.email}</span>
                </div>
              )
            },
            {
              header: 'Active Role',
              accessor: (u) => (
                <Badge variant={u.role === 'admin' ? 'danger' : u.role === 'instructor' ? 'secondary' : 'primary'}>
                  {u.role}
                </Badge>
              )
            },
            {
              header: 'Joined Date',
              accessor: (u) => <span className="text-text-muted">{u.joinedDate}</span>
            },
            {
              header: 'Change Role Options',
              accessor: (u) => (
                <div className="flex flex-wrap gap-1">
                  <Button variant="outline" size="sm" onClick={() => handleRoleChange(u.id, 'student')} disabled={u.role === 'student'}>
                    Student
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleRoleChange(u.id, 'instructor')} disabled={u.role === 'instructor'}>
                    Instructor
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleRoleChange(u.id, 'admin')} disabled={u.role === 'admin'}>
                    Admin
                  </Button>
                </div>
              )
            }
          ]}
        />
      )}

      {toast && <ToastNotification message={toast} onClose={() => setToast(null)} />}
    </DashboardLayout>
  );
};

// ==========================================
// 3. COURSE MANAGEMENT PAGE
// ==========================================
export const CourseManagementPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseApps, setCourseApps] = useState<CourseApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const loadData = async () => {
    const c = await mockApi.getCourses({ instructorId: '' });
    const ca = await mockApi.getCourseApprovals();
    setCourses(c);
    setCourseApps(ca);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (courseId: string, action: 'approved' | 'rejected') => {
    await mockApi.approveCourse(courseId, action);
    setToast(`Course status successfully set to ${action}!`);
    loadData();
  };

  return (
    <DashboardLayout>
      <PageHeader title="Course Management" description="Approve submitted drafts or publish courses." />

      {loading ? (
        <LoadingSkeleton variant="table" count={3} />
      ) : (
        <div className="space-y-8 text-left">
          {/* Pending queue */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-main">Syllabus Approvals Queue</h3>
            <Table 
              data={courseApps.filter(a => a.status === 'pending')}
              columns={[
                {
                  header: 'Course Title',
                  accessor: (a) => <span className="font-bold text-text-main">{a.courseTitle}</span>
                },
                {
                  header: 'Instructor',
                  accessor: (a) => <span className="text-text-muted">{a.instructorName}</span>
                },
                {
                  header: 'Submitted',
                  accessor: (a) => <span className="text-text-subtle">{new Date(a.submittedAt).toLocaleDateString()}</span>
                },
                {
                  header: 'Actions',
                  accessor: (a) => (
                    <div className="flex gap-2">
                      <Button variant="success" size="sm" onClick={() => handleApprove(a.courseId, 'approved')}>
                        Approve
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleApprove(a.courseId, 'rejected')}>
                        Reject
                      </Button>
                    </div>
                  )
                }
              ]}
              emptyMessage="No pending course drafts awaiting moderation."
            />
          </div>

          {/* Active listings */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-main">Platform Course List</h3>
            <Table 
              data={courses}
              columns={[
                {
                  header: 'Title',
                  accessor: (c) => <span className="font-bold text-text-main">{c.title}</span>
                },
                {
                  header: 'Instructor',
                  accessor: (c) => <span className="text-text-muted">{c.instructorName}</span>
                },
                {
                  header: 'Category',
                  accessor: (c) => <Badge variant="secondary">{c.category}</Badge>
                },
                {
                  header: 'Registrants',
                  accessor: (c) => <span className="text-text-subtle">{c.enrolledCount} Students</span>
                },
                {
                  header: 'Status',
                  accessor: (c) => <Badge variant={c.status === 'published' ? 'success' : 'neutral'}>{c.status}</Badge>
                }
              ]}
            />
          </div>
        </div>
      )}

      {toast && <ToastNotification message={toast} onClose={() => setToast(null)} />}
    </DashboardLayout>
  );
};

// ==========================================
// 4. CATEGORY MANAGEMENT PAGE
// ==========================================
export const CategoryManagementPage: React.FC = () => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Code');
  const [toast, setToast] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setToast(`Category "${name}" successfully created!`);
    setName('');
  };

  return (
    <DashboardLayout>
      <PageHeader title="Category Management" description="Add or customize course subject categories." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <Card className="p-6 bg-surface border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Category Name" placeholder="e.g. Machine Learning" value={name} onChange={e => setName(e.target.value)} required />
            <Select 
              label="Lucide Icon Match"
              value={icon}
              options={[
                { value: 'Code', label: 'Code Bracket' },
                { value: 'Database', label: 'Database Storage' },
                { value: 'Figma', label: 'Figma Vector' },
                { value: 'Smartphone', label: 'Smartphone Device' },
                { value: 'TrendingUp', label: 'Trending Up Chart' },
              ]}
              onChange={e => setIcon(e.target.value)}
            />
            <div className="pt-2">
              <Button type="submit" className="w-full">Create Category</Button>
            </div>
          </form>
        </Card>

        <Card className="p-5 border border-border space-y-3 bg-surface">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">Help guide</h4>
          <p className="text-xs text-text-muted leading-relaxed">
            Categories classify course syllabus nodes in the public catalog search. Ensure newly added categories utilize supported icon hooks.
          </p>
        </Card>
      </div>

      {toast && <ToastNotification message={toast} onClose={() => setToast(null)} />}
    </DashboardLayout>
  );
};

// ==========================================
// 5. INSTRUCTOR APPROVAL PAGE
// ==========================================
export const InstructorApprovalPage: React.FC = () => {
  const [approvals, setApprovals] = useState<InstructorApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const loadApprovals = async () => {
    const data = await mockApi.getInstructorApprovals();
    setApprovals(data);
    setLoading(false);
  };

  useEffect(() => {
    loadApprovals();
  }, []);

  const handleApprove = async (id: string, action: 'approved' | 'rejected') => {
    await mockApi.approveInstructor(id, action);
    setToast(`Instructor application set to ${action}!`);
    loadApprovals();
  };

  return (
    <DashboardLayout>
      <PageHeader title="Instructor Approvals Queue" description="Verify teacher bios, portfolios, and approve teaching privileges." />

      {loading ? (
        <LoadingSkeleton variant="table" count={3} />
      ) : (
        <Table 
          data={approvals.filter(a => a.status === 'pending')}
          columns={[
            {
              header: 'Applicant Name',
              accessor: (a) => (
                <div>
                  <span className="font-bold text-text-main block">{a.name}</span>
                  <span className="text-xs text-text-muted">{a.email}</span>
                </div>
              )
            },
            {
              header: 'Biography summary',
              accessor: (a) => <p className="text-xs text-text-muted italic max-w-sm leading-relaxed">"{a.bio}"</p>
            },
            {
              header: 'Verification File',
              accessor: (a) => (
                <span className="text-xs font-semibold text-secondary hover:underline cursor-pointer flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 text-secondary" /> {a.resumeUrl}
                </span>
              )
            },
            {
              header: 'Actions',
              accessor: (a) => (
                <div className="flex gap-2">
                  <Button variant="success" size="sm" onClick={() => handleApprove(a.id, 'approved')}>
                    Approve
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleApprove(a.id, 'rejected')}>
                    Reject
                  </Button>
                </div>
              )
            }
          ]}
          emptyMessage="No pending teacher applications."
        />
      )}

      {toast && <ToastNotification message={toast} onClose={() => setToast(null)} />}
    </DashboardLayout>
  );
};

// ==========================================
// 6. REPORTS PAGE & PLATFORM SETTINGS
// ==========================================
export const ReportsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Platform Analytics Logs" description="Review system operations, database growths, and financial audits." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <Card className="bg-surface border border-border p-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">Student Growth Logs</h4>
          <Table 
            data={mockAdminStats.userGrowth}
            columns={[
              {
                header: 'Month',
                accessor: (g) => <span className="font-bold text-text-main">{g.name}</span>
              },
              {
                header: 'Total Students',
                accessor: (g) => <span className="text-text-muted">{g.students}</span>
              },
              {
                header: 'Total Instructors',
                accessor: (g) => <span className="text-text-muted">{g.instructors}</span>
              }
            ]}
          />
        </Card>

        <Card className="bg-surface border border-border p-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">Monthly Revenue Reports</h4>
          <Table 
            data={mockAdminStats.revenueGrowth}
            columns={[
              {
                header: 'Month',
                accessor: (r) => <span className="font-bold text-text-main">{r.name}</span>
              },
              {
                header: 'Gross Volume',
                accessor: (r) => <span className="font-bold text-success">${r.amount}</span>
              }
            ]}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export const AdminSettingsPage: React.FC = () => {
  const [maintenance, setMaintenance] = useState(false);
  const [allowSignups, setAllowSignups] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToast('Platform configuration settings saved!');
  };

  return (
    <DashboardLayout>
      <PageHeader title="Platform Configuration" description="Modify platform accessibility toggles and server rules." />

      <Card className="max-w-xl mx-auto p-6 bg-surface border border-border text-left">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-main border-b border-border pb-2">Accessibility Toggles</h4>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-text-main block">Server Maintenance Mode</label>
                <span className="text-[11px] text-text-muted">Directs all incoming public pages to a static downtime card.</span>
              </div>
              <input 
                type="checkbox" 
                checked={maintenance} 
                onChange={e => setMaintenance(e.target.checked)}
                className="h-4.5 w-4.5 text-secondary focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-text-main block">Allow Public Registration</label>
                <span className="text-[11px] text-text-muted">Enables or disables signup page submission forms.</span>
              </div>
              <input 
                type="checkbox" 
                checked={allowSignups} 
                onChange={e => setAllowSignups(e.target.checked)}
                className="h-4.5 w-4.5 text-secondary focus:ring-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit">Save Platform Rules</Button>
          </div>
        </form>
      </Card>

      {toast && <ToastNotification message={toast} onClose={() => setToast(null)} />}
    </DashboardLayout>
  );
};
