import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { 
  BookOpen, Star, Clock, User, ArrowRight, Code, 
  Database, Palette, Smartphone, TrendingUp, ShieldCheck, Zap, 
  Award, Phone, Mail, MapPin, Send, Check, Play
} from 'lucide-react';
import { 
  Button, Input, Textarea, Card, Badge, Accordion, StatsCard, 
  SearchBar, FilterBar, EmptyState, LoadingSkeleton 
} from '../components/ui';
import { CourseCard, CourseGrid, CourseHero, BentoFeatureCard } from '../components/lms';
import { PublicNavbar, Footer } from '../components/layout';
import { LiveLearnersCard } from '../components/playhtml/LiveLearnersCard';
import { LearningWall } from '../components/playhtml/LearningWall';
import { CoursePulse } from '../components/playhtml/CoursePulse';
import { useCourses, useCourseDetails } from '../hooks/useCourses';
import { useAuth } from '../hooks/useAuth';
import { useProgress } from '../hooks/useProgress';
import { mockCategories, mockTestimonials } from '../data/mockData';

// Animation Stack Imports
import { AnimatedBackground } from '../components/animations/AnimatedBackground';
import { MagneticButton } from '../components/animations/MagneticButton';
import { ScrollReveal } from '../components/animations/ScrollReveal';
import { AnimatedBentoPreview } from '../components/animations/AnimatedBentoPreview';
import { ModelEmbed } from '../components/media/ModelEmbed';
import { PageTransition } from '../components/animations/PageTransition';
import { PageEnter } from '../components/animations/PageEnter';
import { gsap } from '../animations/gsapSetup';
// ==========================================
// 1. LANDING PAGE
// ==========================================
export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { courses, loading } = useCourses();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // If user prefers reduced motion, do not run GSAP animations
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const ctx = gsap.context(() => {
      // 1. Hero text entrance
      gsap.from('.hero-entrance-gsap', {
        y: 32,
        opacity: 0,
        scale: 0.96,
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.08,
      });

      // 2. Bento features grid reveal
      gsap.from('.bento-feature-card-gsap', {
        scrollTrigger: {
          trigger: '.bento-feature-grid-sec',
          start: 'top 80%',
        },
        y: 32,
        opacity: 0,
        scale: 0.96,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
      });

      // 3. Popular courses reveal
      gsap.from('.popular-courses-sec .course-card-gsap', {
        scrollTrigger: {
          trigger: '.popular-courses-sec',
          start: 'top 80%',
        },
        y: 32,
        opacity: 0,
        scale: 0.96,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
      });

      // 4. Testimonials reveal
      gsap.from('.testimonial-card-gsap', {
        scrollTrigger: {
          trigger: '.testimonials-sec',
          start: 'top 80%',
        },
        y: 32,
        opacity: 0,
        scale: 0.96,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
      });

      // 5. Pricing card stagger
      gsap.from('.pricing-card-gsap', {
        scrollTrigger: {
          trigger: '.pricing-cards-sec',
          start: 'top 80%',
        },
        y: 32,
        opacity: 0,
        scale: 0.96,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
      });

      // 6. FAQ reveal
      gsap.from('.faq-gsap', {
        scrollTrigger: {
          trigger: '.faq-sec',
          start: 'top 80%',
        },
        y: 32,
        opacity: 0,
        scale: 0.96,
        duration: 0.7,
        ease: 'power3.out',
      });

      // 7. Footer promo reveal
      gsap.from('.footer-promo-gsap', {
        scrollTrigger: {
          trigger: '.footer-promo-sec',
          start: 'top 85%',
        },
        y: 32,
        opacity: 0,
        scale: 0.96,
        duration: 0.7,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  const popularCourses = courses.slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
  };

  const getStartedPath = user ? `/${user.role}/dashboard` : '/signup';

  const categoryIcons = {
    'Code': <Code className="h-5 w-5 text-secondary" />,
    'Database': <Database className="h-5 w-5 text-secondary" />,
    'Figma': <Palette className="h-5 w-5 text-secondary" />,
    'Smartphone': <Smartphone className="h-5 w-5 text-secondary" />,
    'TrendingUp': <TrendingUp className="h-5 w-5 text-secondary" />
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-bg relative overflow-hidden">
        <AnimatedBackground />
        <PublicNavbar />
        
        {/* 1. HERO SECTION */}
        <section className="relative px-6 py-16 sm:py-24 max-w-7xl mx-auto text-left w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Glow watermarks */}
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none -z-10" />

          <div className="lg:col-span-7 space-y-6">
            <PageEnter.Item delay={0.15}>
              <Badge variant="primary">Next Generation Learning</Badge>
            </PageEnter.Item>
            
            <div className="space-y-2">
              <PageEnter.Item delay={0.25} y={15}>
                <span className="block text-4xl sm:text-5xl lg:text-6xl font-black text-text-main tracking-tight leading-[1.05]">
                  Master new skills with
                </span>
              </PageEnter.Item>
              <PageEnter.Item delay={0.35} y={15}>
                <span className="block text-4xl sm:text-5xl lg:text-6xl font-black text-text-main tracking-tight leading-[1.05]">
                  <span className="text-secondary underline decoration-primary decoration-4">Bento Grid Layouts</span>
                </span>
              </PageEnter.Item>
            </div>

            <PageEnter.Item delay={0.45}>
              <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-xl font-normal">
                A production-ready platform prioritizing clear typography, structural spacing, and WCAG-compliant design aesthetics.
              </p>
            </PageEnter.Item>

            <PageEnter.Item delay={0.55} scale={0.97}>
              <div className="flex flex-wrap gap-4 pt-2">
                <MagneticButton>
                  <Button size="lg" onClick={() => navigate(getStartedPath)}>
                    Get Started Free
                  </Button>
                </MagneticButton>
                <MagneticButton>
                  <Button size="lg" variant="outline" onClick={() => navigate('/courses')}>
                    Browse Courses
                  </Button>
                </MagneticButton>
              </div>
            </PageEnter.Item>
            
            <div className="pt-6 border-t border-border flex flex-wrap items-center gap-6 text-xs text-text-subtle font-bold uppercase tracking-wider overflow-hidden">
              <PageEnter.Item delay={0.65} className="inline-block" y={10}>
                <span>✓ 10,000+ Enrolled Students</span>
              </PageEnter.Item>
              <PageEnter.Item delay={0.75} className="inline-block" y={10}>
                <span>✓ WCAG 2.2 AA Accessible</span>
              </PageEnter.Item>
              <PageEnter.Item delay={0.85} className="inline-block" y={10}>
                <span>✓ Verified Instructor Syllabus</span>
              </PageEnter.Item>
            </div>
          </div>

          {/* Live Learners Count & Dashboard Preview mockup */}
          <div className="lg:col-span-5 w-full flex flex-col gap-6">
            <PageEnter.Item delay={0.7} scale={0.95} duration={0.85}>
              <AnimatedBentoPreview />
            </PageEnter.Item>
            <PageEnter.Item delay={1.1} y={15} duration={0.85}>
              <LiveLearnersCard />
            </PageEnter.Item>
          </div>
        </section>

      {/* 2. SEARCH & CATS SECTION */}
      <section className="bg-bg-elevated border-y border-border py-12 px-6 w-full">
        <div className="max-w-7xl mx-auto space-y-8">
          <ScrollReveal direction="up">
            <div className="max-w-xl mx-auto text-center space-y-4">
              <h2 className="text-2xl font-black text-text-main">What do you want to learn today?</h2>
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search Python, React, UI/UX..." />
                <Button type="submit">Search</Button>
              </form>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {mockCategories.map((cat) => {
                const iconKey = cat.icon as keyof typeof categoryIcons;
                return (
                  <Card 
                    key={cat.id} 
                    hoverable 
                    onClick={() => navigate(`/courses?category=${encodeURIComponent(cat.name)}`)}
                    className="flex items-center gap-3.5 p-4 bg-surface border border-border text-left cursor-pointer"
                  >
                    <div className="p-2.5 bg-secondary/10 text-secondary rounded-ctrl">
                      {categoryIcons[iconKey] || <BookOpen className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text-main leading-none mb-1.5">{cat.name}</h4>
                      <span className="text-[10px] text-text-subtle font-semibold">{cat.count} Courses</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. BENTO FEATURE GRID */}
      <section className="bento-feature-grid-sec px-6 py-16 sm:py-24 max-w-7xl mx-auto w-full text-left space-y-10">
        <ScrollReveal direction="up">
          <div className="max-w-xl text-left space-y-2">
            <Badge variant="secondary">Platform Features</Badge>
            <h2 className="text-3xl font-black tracking-tight text-text-main">Structured Bento Modules</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bento-feature-card-gsap">
            <BentoFeatureCard
              title="Interactive Syllabus Player"
              description="Collapsible split-screen course player loaded with resource attachments, code cheat sheets, and notebook sync tools."
              icon={<BookOpen className="h-6 w-6" />}
              badge="Premium"
              className="h-full"
            />
          </div>
          <div className="bento-feature-card-gsap">
            <BentoFeatureCard
              title="WCAG 2.2 Standard"
              description="Full keyboard focus states, high contrast text variables, and accessible labels built from day one."
              icon={<ShieldCheck className="h-6 w-6" />}
              className="h-full"
            />
          </div>
          <div className="bento-feature-card-gsap">
            <BentoFeatureCard
              title="Instant Certificate Generation"
              description="Achieve 100% curriculum completion and pass final quizzes to unlock public credential validation codes."
              icon={<Award className="h-6 w-6" />}
              className="h-full"
            />
          </div>
          <div className="md:col-span-2 bento-feature-card-gsap">
            <BentoFeatureCard
              title="Local Simulation Mode"
              description="State structures persisted entirely in LocalStorage for lightning fast offline validation before cloud deployment."
              icon={<Zap className="h-6 w-6" />}
              badge="Offline"
              className="h-full"
            />
          </div>
        </div>
      </section>

      {/* 4. POPULAR COURSES PREVIEW */}
      <section className="popular-courses-sec bg-bg-elevated border-t border-border py-16 sm:py-24 px-6 w-full text-left">
        <div className="max-w-7xl mx-auto space-y-10">
          <ScrollReveal direction="up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <Badge variant="success">Active Catalog</Badge>
                <h2 className="text-3xl font-black tracking-tight text-text-main">Popular Courses</h2>
              </div>
              <Button variant="outline" onClick={() => navigate('/courses')}>
                View Full Catalog <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </ScrollReveal>

          <div className="w-full">
            {loading ? (
              <LoadingSkeleton variant="card" count={3} />
            ) : (
              <CourseGrid courses={popularCourses} disableReveal={true} />
            )}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="testimonials-sec px-6 py-16 max-w-7xl mx-auto w-full text-left space-y-8">
        <ScrollReveal direction="up">
          <div className="max-w-xl space-y-2">
            <Badge variant="primary">Reviews</Badge>
            <h2 className="text-3xl font-black text-text-main tracking-tight">Loved by Learners</h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockTestimonials.map((test, idx) => (
            <div key={idx} className="testimonial-card-gsap">
              <Card className="bg-surface border border-border p-6 flex flex-col justify-between h-full">
                <p className="text-xs text-text-muted italic leading-relaxed mb-6">"{test.content}"</p>
                <div className="flex items-center gap-3">
                  <img src={test.image} alt={test.name} className="h-10 w-10 rounded-full object-cover border border-border/50" />
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-text-main leading-none mb-1">{test.name}</h4>
                    <span className="text-[10px] text-text-subtle font-semibold">{test.role}</span>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* 5.5 LEARNING WALL */}
      <section className="px-6 py-16 max-w-7xl mx-auto w-full text-left border-t border-border">
        <ScrollReveal direction="up">
          <LearningWall />
        </ScrollReveal>
      </section>
 
      {/* 6. PRICING CARDS */}
      <section className="pricing-cards-sec bg-bg-elevated border-t border-border py-16 px-6 w-full text-center">
        <div className="max-w-7xl mx-auto space-y-10">
          <ScrollReveal direction="up">
            <div className="max-w-xl mx-auto space-y-2">
              <Badge variant="secondary">Simple Plans</Badge>
              <h2 className="text-3xl font-black text-text-main tracking-tight">Flexible Pricing</h2>
              <p className="text-xs text-text-subtle font-semibold">Start learning for free and upgrade as your developer career grows.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            {/* Free */}
            <div className="h-full pricing-card-gsap">
              <Card className="bg-surface border border-border p-6 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold uppercase text-text-main">Starter Free</h3>
                    <span className="text-text-subtle text-xs font-semibold">Access to standard public catalog.</span>
                  </div>
                  <div className="text-3xl font-black text-text-main">$0 <span className="text-xs text-text-subtle font-bold uppercase">/ Free forever</span></div>
                  <ul className="space-y-2.5 text-xs text-text-muted font-medium pt-2">
                    <li>✓ Access to all free courses</li>
                    <li>✓ Standard video player</li>
                    <li>✓ Local course progress tracking</li>
                  </ul>
                </div>
                <MagneticButton className="w-full mt-8">
                  <Button variant="outline" className="w-full" onClick={() => navigate(getStartedPath)}>
                    Join Platform
                  </Button>
                </MagneticButton>
              </Card>
            </div>
            
            {/* Pro */}
            <div className="h-full pricing-card-gsap">
              <Card className="bg-surface border-2 border-secondary p-6 flex flex-col justify-between h-full relative">
                <Badge variant="secondary" className="absolute top-3 right-3">Popular</Badge>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold uppercase text-text-main">Pro Learner</h3>
                    <span className="text-text-subtle text-xs font-semibold">Unlock premium advanced builder content.</span>
                  </div>
                  <div className="text-3xl font-black text-text-main">$29 <span className="text-xs text-text-subtle font-bold uppercase">/ monthly</span></div>
                  <ul className="space-y-2.5 text-xs text-text-muted font-medium pt-2">
                    <li>✓ Access to ALL courses (Free & Paid)</li>
                    <li>✓ Interactive final quizzes</li>
                    <li>✓ Printable completion certificates</li>
                    <li>✓ Premium downloadable resources</li>
                  </ul>
                </div>
                <MagneticButton className="w-full mt-8">
                  <Button variant="primary" className="w-full" onClick={() => navigate('/pricing')}>
                    Upgrade Pro
                  </Button>
                </MagneticButton>
              </Card>
            </div>

            {/* Unlimited */}
            <div className="h-full pricing-card-gsap">
              <Card className="bg-surface border border-border p-6 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold uppercase text-text-main">Enterprise Plan</h3>
                    <span className="text-text-subtle text-xs font-semibold">For dev agencies & scaling SaaS teams.</span>
                  </div>
                  <div className="text-3xl font-black text-text-main">$199 <span className="text-xs text-text-subtle font-bold uppercase">/ annually</span></div>
                  <ul className="space-y-2.5 text-xs text-text-muted font-medium pt-2">
                    <li>✓ Dedicated team dashboards</li>
                    <li>✓ Admin user management tables</li>
                    <li>✓ Custom company certification logos</li>
                    <li>✓ Priority SLA developer assistance</li>
                  </ul>
                </div>
                <MagneticButton className="w-full mt-8">
                  <Button variant="outline" className="w-full" onClick={() => navigate('/contact')}>
                    Contact Enterprise
                  </Button>
                </MagneticButton>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="faq-sec px-6 py-16 sm:py-24 max-w-3xl mx-auto w-full text-left space-y-8">
        <ScrollReveal direction="up">
          <h2 className="text-3xl font-black text-text-main text-center">Frequently Asked Questions</h2>
        </ScrollReveal>
        <div className="faq-gsap">
          <Accordion
            items={[
              {
                id: 'faq-1',
                title: 'Is The Learning Collective completely frontend-only?',
                content: 'Yes! The current system behaves as a full React + TypeScript SPA utilizing localStorage to record user logs, quiz scores, course syllabus builder updates, and role navigation. A cloud-ready API service structure makes backend integration simple later.'
              },
              {
                id: 'faq-2',
                title: 'How do I toggle user roles for student, instructor, and admin?',
                content: 'Sign out and click Log In. You can use the pre-built credentials student@thelearningcollective.com (student), instructor@thelearningcollective.com (instructor), or admin@thelearningcollective.com (admin) with passwords (student123, instructor123, admin123) to jump directly into each dashboard.'
              },
              {
                id: 'faq-3',
                title: 'How do I download certificate PDFs?',
                content: 'Once you progress through all lessons of a course and score >= passing grade on the final quiz, click Certificates in the student sidebar. Select the course certificate to view, and click "Print / Save PDF" to trigger the browser document dialog.'
              }
            ]}
          />
        </div>
      </section>

      {/* CTA sections */}
      <section className="footer-promo-sec bg-primary/25 border-y border-border py-16 px-6 text-center w-full">
        <div className="footer-promo-gsap max-w-xl mx-auto space-y-5">
          <h2 className="text-2xl sm:text-3xl font-black text-text-main">Ready to share your expertise?</h2>
          <p className="text-xs text-text-muted">Create instructor accounts, build courses using the syllabus visual outline tool, and track enrolled student progress.</p>
          <div className="flex justify-center gap-3">
            <MagneticButton>
              <Button variant="secondary" onClick={() => navigate('/signup?role=instructor')}>Apply as Instructor</Button>
            </MagneticButton>
            <MagneticButton>
              <Button variant="outline" onClick={() => navigate('/about')}>Learn More</Button>
            </MagneticButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  </PageTransition>
  );
};

// ==========================================
// 2. COURSES PAGE
// ==========================================
export const CoursesPage: React.FC = () => {
  const [search, setSearch] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('search') || '';
  });
  const [category, setCategory] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') || '';
  });
  const [difficulty, setDifficulty] = useState('');
  const [priceType, setPriceType] = useState('');

  const { courses, loading } = useCourses({ search, category, difficulty, priceType });

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-bg relative overflow-hidden">
        <AnimatedBackground />
        <PublicNavbar />
        <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full text-left">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-black text-text-main tracking-tight">Courses Catalog</h1>
              <p className="text-xs text-text-muted mt-1">Filter, search, and register for technical modules.</p>
            </div>
            
            <div className="space-y-4">
              <div className="max-w-md">
                <SearchBar value={search} onChange={setSearch} placeholder="Search course title, description, instructor..." />
              </div>
              
              <FilterBar 
                categories={mockCategories}
                selectedCategory={category}
                onSelectCategory={setCategory}
                selectedDifficulty={difficulty}
                onSelectDifficulty={setDifficulty}
                selectedPriceType={priceType}
                onSelectPriceType={setPriceType}
              />
            </div>

            <hr className="border-border" />

            {loading ? (
              <LoadingSkeleton variant="card" count={3} />
            ) : courses.length > 0 ? (
              <CourseGrid courses={courses} />
            ) : (
              <EmptyState 
                title="No Courses Found" 
                description="No matches found in the catalog. Try resetting search strings or category filters."
                action={
                  <Button onClick={() => { setSearch(''); setCategory(''); setDifficulty(''); setPriceType(''); }}>
                    Reset Filters
                  </Button>
                }
              />
            )}
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

// ==========================================
// 3. COURSE DETAILS PAGE
// ==========================================
export const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingEnroll, setLoadingEnroll] = useState(false);

  const { course, loading, error } = useCourseDetails(id);
  // Query progress using course?.id to ensure slug URLs don't break local progress keying
  const { enrollment, enroll } = useProgress(course?.id, user?.id);

  const handleEnroll = async () => {
    if (!course) return;
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (enrollment) {
      navigate(`/course/${course.id}/learn`);
      return;
    }

    setLoadingEnroll(true);
    const success = await enroll();
    setLoadingEnroll(false);
    if (success) {
      navigate(`/course/${course.id}/learn`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-bg">
        <PublicNavbar />
        <div className="flex-grow max-w-7xl mx-auto px-4 py-16 w-full">
          <LoadingSkeleton variant="profile" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col min-h-screen bg-bg">
        <PublicNavbar />
        <div className="flex-grow max-w-7xl mx-auto px-4 py-16 w-full">
          <EmptyState 
            title="Course Error" 
            description={error || "Could not retrieve course detail views."}
            action={<Button onClick={() => navigate('/courses')}>Return to Catalog</Button>}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-bg relative overflow-hidden">
        <AnimatedBackground />
        <PublicNavbar />
        
        <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full text-left">
          <CourseHero 
            course={course}
            enrolled={!!enrollment}
            progress={enrollment?.progress}
            onEnroll={handleEnroll}
            loadingEnroll={loadingEnroll}
          />
  
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Syllabus modules & descriptions */}
            <div className="lg:col-span-8 space-y-6">
              {/* Full description */}
              <Card className="bg-surface border border-border p-6 text-left">
                <h3 className="text-base font-extrabold text-text-main uppercase tracking-wider mb-3">
                  About this course
                </h3>
                <p className="text-xs text-text-muted leading-relaxed font-semibold">
                  {course.fullDescription || course.description}
                </p>
              </Card>

              {/* 3D Model Accent (Only render if course has modelPath or modelEmbedUrl) */}
              {(course.modelPath || course.modelEmbedUrl) && (
                <div className="space-y-3 text-left">
                  <h3 className="text-sm font-extrabold text-text-main uppercase tracking-wider">
                    Interactive Syllabus 3D Asset
                  </h3>
                  <ModelEmbed 
                    modelEmbedUrl={course.modelEmbedUrl} 
                    modelPath={course.modelPath}
                    fallbackImage={course.thumbnail}
                    title={course.title}
                  />
                </div>
              )}
  
              {/* What you will learn */}
              <Card className="bg-surface border border-border p-6">
                <h3 className="text-base font-extrabold text-text-main uppercase tracking-wider mb-4">
                  What you will learn in this course
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-text-muted font-semibold">
                  {course.outcomes && course.outcomes.length > 0 ? (
                    course.outcomes.map((outcome, idx) => (
                      <li key={idx} className="flex gap-2">
                        <Check className="h-4.5 w-4.5 text-success flex-shrink-0" strokeWidth={3} /> {outcome}
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex gap-2"><Check className="h-4.5 w-4.5 text-success flex-shrink-0" /> Hands-on real-world building projects</li>
                      <li className="flex gap-2"><Check className="h-4.5 w-4.5 text-success flex-shrink-0" /> High-quality video modules & references</li>
                      <li className="flex gap-2"><Check className="h-4.5 w-4.5 text-success flex-shrink-0" /> Self-paced curriculum scheduling</li>
                      <li className="flex gap-2"><Check className="h-4.5 w-4.5 text-success flex-shrink-0" /> Certification credentials validated on LinkedIn</li>
                    </>
                  )}
                </ul>
              </Card>
  
              {/* Curriculum section list preview */}
              <Card className="bg-surface border border-border p-6 text-left">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base font-extrabold text-text-main uppercase tracking-wider">
                      Course Curriculum
                    </h3>
                    <span className="text-[10px] text-text-subtle font-semibold">
                      {course.modules.length} Modules • self paced
                    </span>
                  </div>
                </div>
  
                <div className="space-y-3">
                  {course.modules.map((mod) => (
                    <div 
                      key={mod.id}
                      className="flex items-center justify-between p-3.5 bg-surface-muted/50 border border-border/65 rounded-ctrl text-xs font-semibold"
                    >
                      <div className="flex items-center gap-3">
                        <Play className="h-3.5 w-3.5 text-secondary flex-shrink-0" />
                        <span className="text-text-muted">{mod.title}</span>
                      </div>
                      <span className="text-[10px] text-text-subtle flex items-center gap-1.5">{mod.lessons.length} Lessons</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
  
            {/* Right details sidebar actions */}
            <div className="lg:col-span-4 space-y-6">
              {/* Pricing access card */}
              <Card className="bg-surface border border-border p-6 text-left space-y-5">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-text-muted font-bold">Course Price</span>
                  <span className="text-xl font-black text-text-main">
                    {course.isFree ? 'FREE' : (
                      <span className="flex items-center gap-1.5">
                        {course.originalPrice && <span className="line-through text-text-subtle text-xs font-normal">${course.originalPrice}</span>}
                        <span>${course.price}</span>
                      </span>
                    )}
                  </span>
                </div>
                <Button 
                  variant={enrollment ? 'secondary' : 'primary'} 
                  className="w-full mt-2"
                  loading={loadingEnroll}
                  onClick={handleEnroll}
                >
                  {enrollment ? 'Resume Syllabus' : (course.isFree ? 'Enroll Free' : 'Purchase Access')}
                </Button>
              </Card>
  
              {/* Instructor card */}
              <Card className="bg-surface border border-border p-5 text-center space-y-4">
                <h4 className="text-xs font-bold text-text-subtle uppercase tracking-wider">Course Instructor</h4>
                <div className="flex flex-col items-center gap-2 pt-2">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" 
                    alt={course.instructorName} 
                    className="h-14 w-14 rounded-full object-cover border border-border"
                  />
                  <h4 className="text-sm font-extrabold text-text-main">{course.instructorName}</h4>
                  <Badge variant="secondary">Verified Teacher</Badge>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed font-semibold">
                  Expert software educator who has trained over 100,000 developers. Focuses on code readability, accessibility, and production architecture patterns.
                </p>
              </Card>
  
              {/* Certificate information */}
              {course.certificateAvailable && (
                <Card className="bg-surface border border-border p-5 text-left space-y-3">
                  <h4 className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
                    <Award className="h-5 w-5 text-warning" /> Verified Credentials
                  </h4>
                  <p className="text-[11px] text-text-muted leading-relaxed font-semibold">
                    Earn a verified completion certificate from our platform upon completing all modules, checkbox lessons, and passing the competency assessment quiz.
                  </p>
                </Card>
              )}
  
              {/* Collaborative Class Pulse reactions */}
              <CoursePulse courseId={course.id} />
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

// ==========================================
// 4. PRICING PAGE
export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-bg relative overflow-hidden">
        <AnimatedBackground />
        <PublicNavbar />
        <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full text-center space-y-10">
          <ScrollReveal direction="up">
            <div className="max-w-xl mx-auto space-y-2">
              <Badge variant="secondary">Access Options</Badge>
              <h1 className="text-3xl font-black text-text-main tracking-tight">Flexible Payment Models</h1>
              <p className="text-xs text-text-subtle font-semibold">Choose the membership tier that fits your education timeline.</p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            {/* Free */}
            <ScrollReveal direction="up" delay={0.1} className="h-full">
              <Card className="bg-surface border border-border p-6 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase text-text-main">Basic Starter</h3>
                    <span className="text-text-subtle text-[11px] font-semibold">Best for exploring public courses.</span>
                  </div>
                  <div className="text-3xl font-black text-text-main">$0 <span className="text-xs text-text-subtle font-bold uppercase">/ Free forever</span></div>
                  <ul className="space-y-2.5 text-xs text-text-muted font-medium pt-2">
                    <li>✓ Access to 10+ free catalog courses</li>
                    <li>✓ Local localStorage progress tracker</li>
                    <li>✓ Course syllabus visual previews</li>
                  </ul>
                </div>
                <MagneticButton className="w-full mt-8">
                  <Button variant="outline" className="w-full" onClick={() => navigate('/signup')}>
                    Sign Up Free
                  </Button>
                </MagneticButton>
              </Card>
            </ScrollReveal>
            
            {/* Pro */}
            <ScrollReveal direction="up" delay={0.2} className="h-full">
              <Card className="bg-surface border-2 border-secondary p-6 flex flex-col justify-between h-full relative">
                <Badge variant="secondary" className="absolute top-3 right-3">Recommended</Badge>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase text-text-main">Pro Learner</h3>
                    <span className="text-text-subtle text-[11px] font-semibold">Unlock all curriculum and credentials.</span>
                  </div>
                  <div className="text-3xl font-black text-text-main">$29 <span className="text-xs text-text-subtle font-bold uppercase">/ monthly</span></div>
                  <ul className="space-y-2.5 text-xs text-text-muted font-medium pt-2">
                    <li>✓ Access to ALL courses (Free & Paid)</li>
                    <li>✓ Interactive final quizzes & answer keys</li>
                    <li>✓ Verified printable completion certificates</li>
                    <li>✓ Premium downloadable resources</li>
                  </ul>
                </div>
                <MagneticButton className="w-full mt-8">
                  <Button variant="primary" className="w-full" onClick={() => navigate('/signup?tier=pro')}>
                    Subscribe Pro
                  </Button>
                </MagneticButton>
              </Card>
            </ScrollReveal>
  
            {/* Unlimited */}
            <ScrollReveal direction="up" delay={0.3} className="h-full">
              <Card className="bg-surface border border-border p-6 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase text-text-main">Enterprise Teams</h3>
                    <span className="text-text-subtle text-[11px] font-semibold">Manage team seats and analytics.</span>
                  </div>
                  <div className="text-3xl font-black text-text-main">$199 <span className="text-xs text-text-subtle font-bold uppercase">/ annually</span></div>
                  <ul className="space-y-2.5 text-xs text-text-muted font-medium pt-2">
                    <li>✓ Includes 5 team workspace member seats</li>
                    <li>✓ Admin dashboards for student completions</li>
                    <li>✓ Custom company certification logos</li>
                    <li>✓ Priority SLA technical helpdesk</li>
                  </ul>
                </div>
                <MagneticButton className="w-full mt-8">
                  <Button variant="outline" className="w-full" onClick={() => navigate('/contact')}>
                    Contact Team Sales
                  </Button>
                </MagneticButton>
              </Card>
            </ScrollReveal>
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

// ==========================================
// 5. ABOUT PAGE
// ==========================================
export const AboutPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-bg relative overflow-hidden">
        <AnimatedBackground />
        <PublicNavbar />
        <div className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full text-left space-y-10">
          <ScrollReveal direction="up">
            <div className="space-y-2">
              <Badge variant="primary">Our Story</Badge>
              <h1 className="text-3xl font-black text-text-main tracking-tight">About The Learning Collective</h1>
              <p className="text-xs text-text-muted">An educational platform designed for readability, clean spacing, and offline durability.</p>
            </div>
          </ScrollReveal>
  
          <ScrollReveal direction="up" delay={0.2}>
            <Card className="p-6 bg-surface border border-border leading-relaxed text-sm text-text-muted space-y-4">
              <p>
                The Learning Collective was conceptualized to address modern education portal fatigue. Too often, learning tools are clogged with slow API bundles, distracting layouts, and inconsistent user experiences.
              </p>
              <p>
                We adhere strictly to the <strong>Bento Design System</strong>. By boxing dashboard stats, course syllabus builders, and video players into rigid cells, students read content with structured focus.
              </p>
              <p>
                We are committed to accessibility compliance (WCAG 2.2 AA). Every button, input form, and responsive navigation drawer has explicit tab traversal rules, visible focus indicators, and descriptive labels.
              </p>
            </Card>
          </ScrollReveal>
  
          {/* Bento grid showcase */}
          <div className="grid grid-cols-2 gap-4">
            <ScrollReveal direction="up" delay={0.3}>
              <Card className="p-4 bg-primary/10 border-transparent h-full">
                <h3 className="text-xs font-bold text-text-main uppercase mb-1">Our Core Value</h3>
                <span className="text-[11px] text-text-muted">Education must be structured, accessible, and fast.</span>
              </Card>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.4}>
              <Card className="p-4 bg-secondary/10 border-transparent h-full">
                <h3 className="text-xs font-bold text-text-main uppercase mb-1">Our Technology</h3>
                <span className="text-[11px] text-text-muted">Built with React, TypeScript, and Tailwind CSS v4.</span>
              </Card>
            </ScrollReveal>
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

// ==========================================
// 6. CONTACT PAGE
// ==========================================
export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msg) return;
    setSent(true);
    setName('');
    setEmail('');
    setMsg('');
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-bg relative overflow-hidden">
        <AnimatedBackground />
        <PublicNavbar />
        <div className="flex-grow max-w-5xl mx-auto px-4 py-12 w-full text-left grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Form panel */}
          <div className="md:col-span-7 space-y-6">
            <ScrollReveal direction="up">
              <div className="space-y-2">
                <Badge variant="secondary">Get in Touch</Badge>
                <h1 className="text-3xl font-black text-text-main tracking-tight">Contact Our Team</h1>
                <p className="text-xs text-text-muted">Need help with seat billing, teacher accounts, or course creation?</p>
              </div>
            </ScrollReveal>
  
            <ScrollReveal direction="up" delay={0.2}>
              <Card className="p-6 bg-surface border border-border">
                {sent ? (
                  <div className="py-8 text-center space-y-3">
                    <Badge variant="success">Message Sent</Badge>
                    <h4 className="text-sm font-extrabold text-text-main">Thank You!</h4>
                    <p className="text-xs text-text-muted max-w-xs mx-auto">We have received your contact request and will reply within 24 hours.</p>
                    <Button variant="outline" size="sm" onClick={() => setSent(false)}>Send another message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                    <Input label="Email address" type="email" placeholder="john@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    <Textarea label="Message" placeholder="Type your query..." value={msg} onChange={e => setMsg(e.target.value)} required />
                    <div className="pt-2">
                      <Button type="submit" className="w-full" icon={<Send className="h-4 w-4" />}>Send Message</Button>
                    </div>
                  </form>
                )}
              </Card>
            </ScrollReveal>
          </div>
  
          {/* Info panel */}
          <div className="md:col-span-5 space-y-4">
            <ScrollReveal direction="up" delay={0.3}>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-text-main">Office Details</h3>
              <Card className="p-5 bg-surface border border-border space-y-5 text-xs text-text-muted font-medium">
                <div className="flex gap-3 items-start">
                  <MapPin className="h-5 w-5 text-secondary flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-text-main mb-0.5">Location</h4>
                    <span>100 Bento Boulevard, Suite 500, Tech City</span>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Phone className="h-5 w-5 text-secondary flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-text-main mb-0.5">Telephone</h4>
                    <span>+1 (555) 880-4520</span>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Mail className="h-5 w-5 text-secondary flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-text-main mb-0.5">Support Email</h4>
                    <span>support@thelearningcollective.com</span>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

// ==========================================
// 7. FAQ PAGE
// ==========================================
export const FaqPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-bg relative overflow-hidden">
        <AnimatedBackground />
        <PublicNavbar />
        <div className="flex-grow max-w-3xl mx-auto px-4 py-12 w-full text-left space-y-8">
          <ScrollReveal direction="up">
            <div className="space-y-2 text-center">
              <Badge variant="primary">Help desk</Badge>
              <h1 className="text-3xl font-black text-text-main tracking-tight">Frequently Asked Questions</h1>
              <p className="text-xs text-text-muted">Instant answers for course purchases, local progress updates, and credentials.</p>
            </div>
          </ScrollReveal>
  
          <ScrollReveal direction="up" delay={0.2}>
            <Accordion
              items={[
                {
                  id: 'faq-a',
                  title: 'What credentials do I use to view the Student, Instructor, and Admin dashboards?',
                  content: 'Click Log In. Log in with (student@thelearningcollective.com / student123) for student views, (instructor@thelearningcollective.com / instructor123) for instructor course designer views, or (admin@thelearningcollective.com / admin123) for user moderation queues.'
                },
                {
                  id: 'faq-b',
                  title: 'Are final course certificates verified?',
                  content: 'Yes! Every generated certificate records unique ID strings (e.g. TLC-CERT-xxxx-xxxxxx) that map directly to our user database. Students print or save certificates to PDF directly from their Certificate tab.'
                },
                {
                  id: 'faq-c',
                  title: 'How does local database replication work?',
                  content: 'On the first mount, the application checks localStorage. If empty, it populates it with verified courses, syllabus structures, and dummy user profiles. Progress checkboxes and new courses save to localStorage immediately.'
                },
                {
                  id: 'faq-d',
                  title: 'Is there a dark mode option available?',
                  content: 'Yes, the portal includes dark mode toggles inside the top header of all Student, Instructor, and Admin dashboard pages, adapting color variables to dark charcoal surfaces.'
                }
              ]}
            />
          </ScrollReveal>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};
