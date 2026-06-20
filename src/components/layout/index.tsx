import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, Award, User, Settings, PlusCircle, Users, 
  BarChart, Menu, Bell, Sun, Moon, LogOut, Home, Mail, 
  HelpCircle, ChevronRight, CheckSquare, Layers, ShieldCheck, Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { Avatar, Button, Badge } from '../ui';
import { getNotifications, setNotifications } from '../../lib/storage';
import { BrandMark } from './BrandMark';
export { BrandMark } from './BrandMark';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { SEO } from '../seo/SEO';

// Animation Stack Imports
import { PageTransition } from '../animations/PageTransition';
import { AnimatedBackground } from '../animations/AnimatedBackground';

// ==========================================
// 1. PUBLIC NAVBAR
// ==========================================
export const PublicNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();


  const links = [
    { label: 'Library', path: '/courses' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'FAQ', path: '/faq' }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    return `/${user.role}/dashboard`;
  };

  return (
    <motion.nav
      className="sticky top-0 z-40 bg-surface/90 border-b border-border"
      initial={prefersReducedMotion ? {} : { y: -20, opacity: 0 }}
      animate={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Mark */}
          <Link to="/" className="focus:outline-none" aria-label="The Learning Collective">
            <BrandMark variant="light" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-semibold text-text-muted hover:text-text-main transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(getDashboardPath())}
                >
                  Dashboard
                </Button>
                <div className="flex items-center gap-2.5">
                  <Avatar name={user.name} src={user.avatarUrl} size="sm" />
                  <button 
                    onClick={handleLogout} 
                    className="p-2 rounded-ctrl text-text-muted hover:text-[#F87171] hover:bg-danger/10 focus:outline-none"
                    aria-label="Logout"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  Log in
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
                  Sign up
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-ctrl text-text-muted hover:text-text-main focus:outline-none"
              aria-label="Toggle Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface py-3 px-4 space-y-3">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-text-muted hover:text-text-main"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <hr className="border-border" />
          <div className="flex flex-col gap-2.5">
            {user ? (
              <>
                <Button variant="outline" className="w-full" onClick={() => { setMobileMenuOpen(false); navigate(getDashboardPath()); }}>
                  Dashboard
                </Button>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Avatar name={user.name} src={user.avatarUrl} size="sm" />
                    <span className="text-sm font-bold text-text-main">{user.name}</span>
                  </div>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }} 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-ctrl text-xs font-semibold text-[#F87171] hover:bg-danger/10"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full" onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}>
                  Log in
                </Button>
                <Button variant="primary" className="w-full" onClick={() => { setMobileMenuOpen(false); navigate('/signup'); }}>
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </motion.nav>
  );
};

// ==========================================
// 2. DASHBOARD SIDEBAR
// ==========================================
interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const DashboardSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const handleThemeChange = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  if (!user) return null;

  // Sidebar link models
  const studentLinks = [
    { label: 'Dashboard', path: '/student/dashboard', icon: <Home /> },
    { label: 'My Courses', path: '/student/my-courses', icon: <BookOpen /> },
    { label: 'Certificates', path: '/student/certificates', icon: <Award /> },
    { label: 'My Profile', path: '/student/profile', icon: <User /> },
    { label: 'Settings', path: '/student/settings', icon: <Settings /> }
  ];

  const instructorLinks = [
    { label: 'Dashboard', path: '/instructor/dashboard', icon: <Home /> },
    { label: 'My Courses', path: '/instructor/courses', icon: <BookOpen /> },
    { label: 'Create Course', path: '/instructor/create-course', icon: <PlusCircle /> },
    { label: 'Enrolled Students', path: '/instructor/students', icon: <Users /> },
    { label: 'Analytics', path: '/instructor/analytics', icon: <BarChart /> },
    { label: 'Settings', path: '/student/settings', icon: <Settings /> }
  ];

  const adminLinks = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <Home /> },
    { label: 'User Management', path: '/admin/users', icon: <Users /> },
    { label: 'Course Management', path: '/admin/courses', icon: <BookOpen /> },
    { label: 'Category Settings', path: '/admin/categories', icon: <Layers /> },
    { label: 'Instructor Approvals', path: '/admin/approvals', icon: <ShieldCheck /> },
    { label: 'Platform Analytics', path: '/admin/analytics', icon: <BarChart /> },
    { label: 'System Settings', path: '/admin/settings', icon: <Settings /> }
  ];

  const linksByRole = {
    student: studentLinks,
    instructor: instructorLinks,
    admin: adminLinks
  };

  const navItems = linksByRole[user.role] || [];

  return (
    <aside 
      className={`fixed top-0 bottom-0 left-0 z-30 w-64 bg-surface border-r border-border transition-transform duration-200 flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Brand Logo Header */}
      <Link 
        to={`/${user.role}/dashboard`}
        className="h-16 flex items-center px-5 border-b border-border bg-bg-elevated focus:outline-none" 
        aria-label="The Learning Collective"
      >
        <BrandMark variant={isDark ? 'dark' : 'light'} />
      </Link>

      {/* Nav List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-ctrl transition-all border ${
                  isActive
                    ? 'bg-primary border-primary/20 text-[#111827] font-bold shadow-sm'
                    : 'bg-transparent border-transparent text-text-muted hover:text-text-main hover:bg-surface-muted'
                }`
              }
            >
              {React.cloneElement(item.icon as React.ReactElement, {
                className: `h-4.5 w-4.5 ${isActive ? 'text-[#111827]' : 'text-text-subtle'}`
              })}
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Role Badge Footer */}
      <div className="p-4 border-t border-border bg-surface-muted flex items-center gap-3">
        <Avatar name={user.name} src={user.avatarUrl} size="sm" />
        <div className="text-left overflow-hidden">
          <p className="text-xs font-bold text-text-main truncate">{user.name}</p>
          <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'instructor' ? 'secondary' : 'primary'} className="capitalize mt-0.5 scale-90 -translate-x-1 origin-left">
            {user.role}
          </Badge>
        </div>
      </div>
    </aside>
  );
};

// ==========================================
// 3. DASHBOARD TOPBAR
// ==========================================
interface TopbarProps {
  onToggleSidebar: () => void;
}

export const DashboardTopbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setNotifs(getNotifications());
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (dark) {
      html.classList.remove('dark');
      setDark(false);
    } else {
      html.classList.add('dark');
      setDark(true);
    }
    window.dispatchEvent(new Event('themechange'));
  };

  const handleNotificationClick = (id: string) => {
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifs(updated);
    setNotifications(updated);
  };

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <header className="h-16 sticky top-0 z-20 bg-bg-elevated border-b border-border flex items-center justify-between px-6">
      {/* Mobile Toggle Drawer Button */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-ctrl text-text-muted hover:text-text-main md:hidden focus:outline-none"
        aria-label="Toggle sidebar menu"
      >
        <Menu className="h-5.5 w-5.5" />
      </button>

      <div className="hidden md:flex text-xs font-bold items-center gap-1.5 uppercase tracking-wider">
        <span className="text-text-subtle">Workspace</span> 
        <ChevronRight className="h-3.5 w-3.5 text-text-subtle" /> 
        <span className="text-text-main capitalize">{user?.role} portal</span>
      </div>

      {/* Control Trays */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Switch */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-ctrl text-text-muted hover:text-text-main hover:bg-surface-muted focus:outline-none"
          aria-label="Toggle Dark Mode"
        >
          {dark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-ctrl text-text-muted hover:text-text-main hover:bg-surface-muted relative focus:outline-none"
            aria-label="Notifications Panel"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-danger animate-pulse" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-surface border border-border rounded-card shadow-lg z-55 py-2">
              <div className="px-4 py-1.5 border-b border-border flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-text-main">Notifications</span>
                {unreadCount > 0 && <Badge variant="danger">{unreadCount} New</Badge>}
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-border">
                {notifs.length > 0 ? (
                  notifs.map((notif) => (
                    <div 
                      key={notif.id} 
                      onClick={() => handleNotificationClick(notif.id)}
                      className={`p-3 text-left cursor-pointer transition-colors ${notif.read ? 'bg-transparent' : 'bg-primary/10 hover:bg-primary/15'}`}
                    >
                      <h4 className="text-xs font-bold text-text-main">{notif.title}</h4>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-snug">{notif.message}</p>
                      <span className="text-[10px] text-text-subtle mt-1 block">{notif.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-text-subtle">No notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Actions */}
        <div className="h-6 w-px bg-border" />
        <Avatar name={user?.name || 'User'} src={user?.avatarUrl} size="sm" />
        <button
          onClick={async () => {
            await logout();
            navigate('/login');
          }}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#F87171] hover:bg-danger/10 px-2.5 py-1.5 rounded-ctrl"
          aria-label="Logout session"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign Out
        </button>
      </div>
    </header>
  );
};

// ==========================================
// 4. FOOTER
// ==========================================
export const Footer: React.FC = () => {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const handleThemeChange = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  return (
    <footer className="bg-surface border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-4 text-left">
          <Link to="/" className="focus:outline-none" aria-label="The Learning Collective">
            <BrandMark variant={isDark ? 'dark' : 'light'} />
          </Link>
          <p className="text-xs text-text-muted leading-relaxed">
            A token-driven Bento Grid learning ecosystem designed to empower students, instructors, and admins in modern knowledge discovery.
          </p>
        </div>
        
        <div className="text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-main mb-3">Library</h4>
          <ul className="space-y-2 text-xs text-text-muted font-semibold">
            <li><Link to="/courses" className="hover:text-secondary">Browse Library</Link></li>
            <li><span className="text-text-subtle">Live Classes (Coming Soon)</span></li>
          </ul>
        </div>

        <div className="text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-main mb-3">Company</h4>
          <ul className="space-y-2 text-xs text-text-muted font-semibold">
            <li><Link to="/about" className="hover:text-secondary">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-secondary">Contact Sales</Link></li>
            <li><Link to="/pricing" className="hover:text-secondary">Pricing Tiers</Link></li>
          </ul>
        </div>

        <div className="text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-main mb-3">Support</h4>
          <ul className="space-y-2 text-xs text-text-muted font-semibold">
            <li><Link to="/faq" className="hover:text-secondary">FAQs & Help</Link></li>
          </ul>
        </div>
      </div>
      
      <hr className="border-border mb-6" />
      
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-text-subtle font-semibold gap-4">
        <span>© {new Date().getFullYear()} The Learning Collective. All rights reserved.</span>
        <div className="flex gap-4">
          <Link to="/terms" className="hover:text-secondary cursor-pointer">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-secondary cursor-pointer">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

// ==========================================
// 5. AUTH LAYOUT
// ==========================================
export const AuthLayout: React.FC<{ children: React.ReactNode; subtitle: string }> = ({ children, subtitle }) => {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const handleThemeChange = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-bg relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <AnimatedBackground />
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="block focus:outline-none mb-6" aria-label="The Learning Collective">
            <BrandMark variant={isDark ? 'dark' : 'light'} layout="vertical" />
          </Link>
          <h2 className="text-center text-2xl font-black text-text-main tracking-tight">
            {subtitle}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
          <div className="bg-surface py-8 px-4 border border-border shadow-lg sm:rounded-overlay sm:px-10">
            {children}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

// ==========================================
// 6. DASHBOARD LAYOUT
// ==========================================
export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <SEO title="Dashboard — The Learning Collective" noIndex />
      <div className="min-h-screen bg-bg flex">
      {/* Sidebar navigation */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main portal wrapper */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <DashboardTopbar onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
    </>
  );
};

// ==========================================
// 7. PAGE HEADER
// ==========================================
interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border mb-6 text-left">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight leading-none">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-text-muted mt-2 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0 flex items-center">{action}</div>}
    </div>
  );
};
