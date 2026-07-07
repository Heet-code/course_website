import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { PlayHTMLProvider } from './providers/PlayHTMLProvider';
import { SmoothScrollProvider } from './components/animations/SmoothScrollProvider';
import { Outlet } from 'react-router-dom';
import './style.css';

// Public Pages
import { 
  LandingPage, CoursesPage, CourseDetailsPage, PricingPage, 
  AboutPage,  ContactPage,
  FaqPage,
  TermsPage,
  PrivacyPage
} from './pages/PublicPages';

// Auth Pages
import { 
  LoginPage, SignupPage, ForgotPasswordPage, ResetPasswordPage, 
  OtpVerificationPage 
} from './pages/AuthPages';

// Student Pages
import { 
  StudentDashboard, MyCourses, CourseLearningPage, QuizResultPage, 
  CertificatesPage, ProfilePage, SettingsPage 
} from './pages/StudentPages';

// Instructor Pages
import { 
  InstructorDashboard, InstructorCoursesPage, CreateCoursePage, 
  EnrolledStudentsPage, AnalyticsPage 
} from './pages/InstructorPages';

// Admin Pages
import { 
  AdminDashboard, UserManagementPage, CourseManagementPage, 
  CategoryManagementPage, InstructorApprovalPage, ReportsPage, 
  AdminSettingsPage 
} from './pages/AdminPages';

// ==========================================
// PROTECTED ROUTE CONTROLLER
// ==========================================
interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: ('student' | 'instructor' | 'admin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-app dark:bg-zinc-950 text-text-main dark:text-white font-semibold">
        <div className="space-y-4 text-center">
          <div className="h-10 w-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-wider text-text-muted">Verifying portal session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Save current path to redirect back after login
    const currentPath = window.location.pathname;
    return <Navigate to={`/login?redirect=${encodeURIComponent(currentPath)}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to user's correct default portal dashboard
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children;
};

// ==========================================
// PUBLIC LAYOUT WRAPPER (SMOOTH SCROLL)
// ==========================================
const PublicLayout = () => {
  return (
    <SmoothScrollProvider>
      <Outlet />
    </SmoothScrollProvider>
  );
};

// ==========================================
// APP ROUTES
// ==========================================
const App = () => {
  return (
    <Routes>
      {/* Public Routes wrapped with Smooth Scroll */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/course/:id" element={<CourseDetailsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />
      </Route>

      {/* Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/otp-verify" element={<OtpVerificationPage />} />

      {/* Student Protected Routes */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/student/my-courses" element={
        <ProtectedRoute allowedRoles={['student']}>
          <MyCourses />
        </ProtectedRoute>
      } />
      <Route path="/course/:id/learn" element={
        <ProtectedRoute allowedRoles={['student']}>
          <CourseLearningPage />
        </ProtectedRoute>
      } />
      <Route path="/course/:id/quiz-result" element={
        <ProtectedRoute allowedRoles={['student']}>
          <QuizResultPage />
        </ProtectedRoute>
      } />
      <Route path="/student/certificates" element={
        <ProtectedRoute allowedRoles={['student']}>
          <CertificatesPage />
        </ProtectedRoute>
      } />
      <Route path="/student/profile" element={
        <ProtectedRoute allowedRoles={['student']}>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/student/settings" element={
        <ProtectedRoute allowedRoles={['student']}>
          <SettingsPage />
        </ProtectedRoute>
      } />

      {/* Instructor Protected Routes */}
      <Route path="/instructor/dashboard" element={
        <ProtectedRoute allowedRoles={['instructor']}>
          <InstructorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/instructor/courses" element={
        <ProtectedRoute allowedRoles={['instructor']}>
          <InstructorCoursesPage />
        </ProtectedRoute>
      } />
      <Route path="/instructor/create-course" element={
        <ProtectedRoute allowedRoles={['instructor']}>
          <CreateCoursePage />
        </ProtectedRoute>
      } />
      <Route path="/instructor/edit-course" element={
        <ProtectedRoute allowedRoles={['instructor']}>
          <CreateCoursePage />
        </ProtectedRoute>
      } />
      <Route path="/instructor/students" element={
        <ProtectedRoute allowedRoles={['instructor']}>
          <EnrolledStudentsPage />
        </ProtectedRoute>
      } />
      <Route path="/instructor/analytics" element={
        <ProtectedRoute allowedRoles={['instructor']}>
          <AnalyticsPage />
        </ProtectedRoute>
      } />

      {/* Admin Protected Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <UserManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/courses" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CourseManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/categories" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CategoryManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/approvals" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <InstructorApprovalPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <ReportsPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminSettingsPage />
        </ProtectedRoute>
      } />

      {/* Fallback Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

import { HelmetProvider } from 'react-helmet-async';
import { CloudflareAnalytics } from './components/analytics/CloudflareAnalytics';

// Mount App
ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <CloudflareAnalytics />
      <BrowserRouter>
        <AuthProvider>
          <PlayHTMLProvider>
            <App />
          </PlayHTMLProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
