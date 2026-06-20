import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
import { useAuth } from '../hooks/useAuth';
import { Input, Button, Badge } from '../components/ui';
import { AuthLayout } from '../components/layout';
import { BookOpen, UserCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { SEO } from '../components/seo/SEO';
import { trackLoginSuccess, trackRoleSelected, trackSignupClick } from '../lib/analytics';
import type { UserRole } from '../types';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

const useTurnstileBypass = () => {
  const [turnstileSupported, setTurnstileSupported] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!(window as any).turnstile) {
        setTurnstileSupported(false);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return turnstileSupported;
};

// ==========================================
// ROLE CREDENTIAL MAP
// ==========================================
const ROLE_CREDENTIALS: Record<UserRole, { email: string; password: string; label: string; description: string; icon: React.ElementType }> = {
  student: {
    email: 'student@thelearningcollective.com',
    password: 'student123',
    label: 'Student',
    description: 'Browse & learn courses',
    icon: BookOpen,
  },
  instructor: {
    email: 'instructor@thelearningcollective.com',
    password: 'instructor123',
    label: 'Instructor',
    description: 'Create & manage content',
    icon: UserCheck,
  },
  admin: {
    email: 'admin@thelearningcollective.com',
    password: 'admin123',
    label: 'Admin',
    description: 'Platform administration',
    icon: ShieldCheck,
  },
};

const ROLES: UserRole[] = ['student', 'instructor', 'admin'];

// ==========================================
// 1. LOGIN PAGE
// ==========================================
export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [turnstileKey, setTurnstileKey] = useState<number>(0);
  const turnstileSupported = useTurnstileBypass();

  const selectRole = useCallback((role: UserRole) => {
    trackRoleSelected(role);
    setSelectedRole(role);
    setError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    // Validate that credentials match the selected role for demo accounts
    const normalizedEmail = email.toLowerCase().trim();
    const expectedCreds = ROLE_CREDENTIALS[selectedRole];
    const isDemoEmail = Object.values(ROLE_CREDENTIALS).some(c => c.email === normalizedEmail);

    if (isDemoEmail && normalizedEmail !== expectedCreds.email) {
      setError(`Selected role "${expectedCreds.label}" does not match these credentials. Please select the correct role or update the email.`);
      return;
    }

    setLoading(true);
    setError(null);

    const res = await login(email, password, selectedRole, turnstileToken);
    setLoading(false);

    if (res.success && res.user) {
      trackLoginSuccess(res.user.role);
      const redirect = searchParams.get('redirect');
      if (redirect) {
        navigate(decodeURIComponent(redirect));
        return;
      }

      if (res.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.user.role === 'instructor') navigate('/instructor/dashboard');
      else navigate('/student/dashboard');
    } else {
      setError(res.error || 'Authentication credentials invalid.');
      setTurnstileKey(prev => prev + 1);
      setTurnstileToken('');
    }
  };

  return (
    <>
      <SEO title="Login — The Learning Collective" noIndex />
      <AuthLayout subtitle="Sign in to The Learning Collective">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-danger/10 text-text-main border border-danger/30 rounded-ctrl text-xs font-semibold text-left">
            {error}
          </div>
        )}

        {/* ==========================================
            ROLE SELECTOR
           ========================================== */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider text-left">
            Choose your role
          </label>
          <div
            className="grid grid-cols-3 gap-2"
            role="radiogroup"
            aria-label="Login role selection"
          >
            {ROLES.map((role) => {
              const cred = ROLE_CREDENTIALS[role];
              const Icon = cred.icon;
              const isSelected = selectedRole === role;

              return (
                <button
                  key={role}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Log in as ${cred.label}`}
                  onClick={() => selectRole(role)}
                  className={`
                    group relative flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-card border-2 transition-all duration-200 cursor-pointer
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-surface
                    ${isSelected
                      ? 'bg-primary border-primary shadow-lg scale-[1.03]'
                      : 'bg-surface-muted/50 border-border hover:border-secondary/60 hover:bg-surface-muted hover:shadow-md'
                    }
                  `}
                >
                  {/* Selected indicator dot */}
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-secondary border-2 border-surface shadow-sm" />
                  )}

                  <div className={`
                    p-2 rounded-lg transition-colors duration-200
                    ${isSelected
                      ? 'bg-surface/70 text-text-main'
                      : 'bg-surface-muted text-text-subtle group-hover:text-secondary'
                    }
                  `}>
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>

                  <span className={`
                    text-[11px] sm:text-xs font-extrabold leading-none transition-colors
                    ${isSelected ? 'text-text-main' : 'text-text-muted group-hover:text-text-main'}
                  `}>
                    {cred.label}
                  </span>

                  <span className={`
                    text-[8px] sm:text-[9px] font-semibold leading-tight text-center hidden sm:block
                    ${isSelected ? 'text-text-muted' : 'text-text-subtle'}
                  `}>
                    {cred.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ==========================================
            CREDENTIALS FIELDS
           ========================================== */}
        <Input
          label="Email address"
          type="email"
          placeholder="student@thelearningcollective.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <div className="text-right pt-0.5">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-xs font-bold text-secondary hover:text-secondary-hover focus:outline-none"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <div className="flex justify-center py-2">
          <Turnstile
            key={turnstileKey}
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() => setTurnstileToken('')}
            onExpire={() => setTurnstileToken('')}
          />
        </div>

        <Button type="submit" className="w-full" loading={loading} disabled={!turnstileToken && turnstileSupported}>
          Sign In as {ROLE_CREDENTIALS[selectedRole].label}
        </Button>

        {/* ==========================================
            DEMO CREDENTIALS HINTS (STATIC)
           ========================================== */}
        <div className="p-4 bg-surface-muted border border-border-strong rounded-ctrl text-xs text-left space-y-2">
          <div className="flex items-center justify-between gap-2 border-b border-border pb-1.5">
            <h4 className="font-extrabold uppercase text-text-main tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-secondary" />
              Demo Credentials
            </h4>
            <span className="text-[9px] font-semibold text-text-subtle">
              Static hints
            </span>
          </div>

          <div className="space-y-1">
            {ROLES.map((role) => {
              const cred = ROLE_CREDENTIALS[role];
              const Icon = cred.icon;

              return (
                <div
                  key={role}
                  className="w-full flex items-center gap-2.5 p-2 rounded-card border border-border/30 text-left bg-surface/30"
                >
                  <div className="p-1 rounded flex-shrink-0 bg-surface-muted text-text-subtle">
                    <Icon className="h-3 w-3" strokeWidth={2.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="font-extrabold text-text-muted block">
                      {cred.label}
                    </span>
                    <span className="text-text-subtle font-mono text-[10px] truncate block">
                      {cred.email}
                    </span>
                  </div>

                  <span className="font-mono text-text-subtle text-[10px] bg-bg border border-border/40 px-1.5 py-0.5 rounded flex-shrink-0">
                    {cred.password}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2 text-center text-xs text-text-muted font-semibold">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="font-extrabold text-secondary hover:text-secondary-hover focus:outline-none underline decoration-2 decoration-primary/45"
          >
            Sign up free
          </button>
        </div>
      </form>
    </AuthLayout>
    </>
  );
};


// ==========================================
// 2. SIGNUP PAGE
// ==========================================
export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [turnstileKey, setTurnstileKey] = useState<number>(0);
  const turnstileSupported = useTurnstileBypass();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await signup(name, email, role, turnstileToken);
    setLoading(false);

    if (res.success) {
      trackSignupClick(role);
      if (role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError(res.error || 'Registration failed.');
      setTurnstileKey(prev => prev + 1);
      setTurnstileToken('');
    }
  };

  return (
    <>
      <SEO title="Sign Up — The Learning Collective" noIndex />
      <AuthLayout subtitle="Join The Learning Collective">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-danger/10 text-text-main border border-danger/30 rounded-ctrl text-xs font-semibold text-left">
            {error}
          </div>
        )}

        <Input
          label="Full name"
          placeholder="Sarah Connor"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <Input
          label="Email address"
          type="email"
          placeholder="sarah@thelearningcollective.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min. 6 characters"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {/* Role Toggler */}
        <div className="text-left">
          <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
            Register as a:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { trackRoleSelected('student'); setRole('student'); }}
              className={`py-2 text-xs font-bold border rounded-ctrl transition-all ${
                role === 'student'
                  ? 'bg-secondary border-secondary text-[#111827] font-black'
                  : 'bg-surface-muted border-border text-text-muted hover:border-secondary'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => { trackRoleSelected('instructor'); setRole('instructor'); }}
              className={`py-2 text-xs font-bold border rounded-ctrl transition-all ${
                role === 'instructor'
                  ? 'bg-secondary border-secondary text-[#111827] font-black'
                  : 'bg-surface-muted border-border text-text-muted hover:border-secondary'
              }`}
            >
              Instructor
            </button>
          </div>
        </div>

        <div className="flex justify-center py-2">
          <Turnstile
            key={turnstileKey}
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() => setTurnstileToken('')}
            onExpire={() => setTurnstileToken('')}
          />
        </div>

        <Button type="submit" className="w-full" loading={loading} disabled={!turnstileToken && turnstileSupported}>
          Create Account
        </Button>

        <div className="pt-2 text-center text-xs text-text-muted font-semibold">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-extrabold text-secondary hover:text-secondary-hover focus:outline-none underline"
          >
            Log in
          </button>
        </div>
      </form>
    </AuthLayout>
    </>
  );
};

// ==========================================
// 3. FORGOT PASSWORD PAGE
// ==========================================
export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError(null);
    
    const res = await forgotPassword(email);
    setLoading(false);
    
    if (res.success) {
      setSent(true);
    } else {
      setError(res.error || 'Failed to send reset email.');
    }
  };

  return (
    <>
      <SEO title="Forgot Password — The Learning Collective" noIndex />
      <AuthLayout subtitle="Reset password | The Learning Collective">
      {sent ? (
        <div className="py-6 text-center space-y-3">
          <Badge variant="primary">Link Sent</Badge>
          <h3 className="text-sm font-bold text-text-main">Check Your Email</h3>
          <p className="text-xs text-text-muted leading-relaxed">If an account with that email exists, we have sent a password reset link.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-text-muted text-left leading-relaxed">
            Enter your account email below. We will send a secure link to reset your password.
          </p>
          
          {error && (
            <div className="p-3 bg-danger/10 text-text-main border border-danger/30 rounded-ctrl text-xs font-semibold text-left">
              {error}
            </div>
          )}

          <Input
            label="Email address"
            type="email"
            placeholder="student@thelearningcollective.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-xs font-bold text-secondary hover:underline focus:outline-none"
            >
              Return to login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
    </>
  );
};

// ==========================================
// 4. RESET PASSWORD PAGE
// ==========================================
export const ResetPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');
  
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    if (pass !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (pass.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const res = await resetPassword(token, pass);
    setLoading(false);
    
    if (res.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setError(res.error || 'Failed to reset password.');
    }
  };

  return (
    <>
      <SEO title="Reset Password — The Learning Collective" noIndex />
      <AuthLayout subtitle="Choose new password | The Learning Collective">
      {success ? (
        <div className="py-6 text-center space-y-3">
          <Badge variant="success">Password Reset!</Badge>
          <p className="text-xs text-text-muted leading-relaxed">Your password has been successfully reset. Redirecting to login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-danger/10 text-text-main border border-danger/30 rounded-ctrl text-xs font-semibold text-left">
              {error}
            </div>
          )}

          <Input
            label="New Password"
            type="password"
            placeholder="Min. 6 characters"
            value={pass}
            onChange={e => setPass(e.target.value)}
            required
            disabled={loading || !token}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            disabled={loading || !token}
          />

          <Button type="submit" className="w-full" disabled={loading || !token}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      )}
    </AuthLayout>
    </>
  );
};

// ==========================================
// 5. OTP VERIFICATION PAGE
// ==========================================
export const OtpVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      navigate('/reset-password');
    }
  };

  return (
    <AuthLayout subtitle="Verify Security Code | The Learning Collective">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-text-muted text-left leading-relaxed">
          Type the 6-digit verification code sent to your email.
        </p>

        <Input
          label="OTP Code"
          placeholder="e.g. 123456"
          maxLength={6}
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
          required
          className="text-center font-mono tracking-widest text-lg"
        />

        <Button type="submit" className="w-full" disabled={otp.length !== 6}>
          Verify Code
        </Button>

        <div className="text-center text-xs text-text-muted font-semibold pt-2">
          Didn't receive a code?{' '}
          <button
            type="button"
            onClick={() => alert('Demo Code: 123456')}
            className="font-bold text-secondary hover:underline focus:outline-none"
          >
            Resend Code
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};
