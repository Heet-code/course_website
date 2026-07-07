import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
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
import { 
  trackCourseClick, 
  trackCourseDetailView, 
  trackEnrollClick, 
  trackPricingCtaClick, 
  trackContactSuccess,
  trackEvent 
} from '../lib/analytics';

// Animation Stack Imports
import { AnimatedBackground } from '../components/animations/AnimatedBackground';
import { MagneticButton } from '../components/animations/MagneticButton';
import { ScrollReveal } from '../components/animations/ScrollReveal';
import { AnimatedBentoPreview } from '../components/animations/AnimatedBentoPreview';
import { ModelEmbed } from '../components/media/ModelEmbed';
import { PageTransition } from '../components/animations/PageTransition';
import { PageEnter } from '../components/animations/PageEnter';
import { gsap } from '../animations/gsapSetup';

// Haikei, Motion Primitives, and Anime.js Imports
import { HaikeiGridPattern, HaikeiWaves, HaikeiBlobGrid } from '../components/ui/HaikeiBackgrounds';
import { TextEffect, InfiniteSlider, OrbitingCircles } from '../components/animations/MotionPrimitives';
import { AnimeBlobMorph, AnimeStaggerGrid } from '../components/animations/AnimeComponents';
import { SEO } from '../components/seo/SEO';

// ==========================================
// 1. LANDING PAGE
// ==========================================
export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { courses, loading } = useCourses();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const landingStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Veloria Academy",
        "url": "https://course-website-pages.kalthiyaheet.workers.dev",
        "logo": "https://course-website-pages.kalthiyaheet.workers.dev/og-image.png"
      },
      {
        "@type": "WebSite",
        "name": "Veloria Academy",
        "url": "https://course-website-pages.kalthiyaheet.workers.dev"
      }
    ]
  };

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
      <SEO structuredData={landingStructuredData} />
      <div className="flex flex-col min-h-screen bg-bg relative overflow-hidden">
        {/* Haikei SVG Overlays */}
        <HaikeiGridPattern />
        <HaikeiBlobGrid />
        
        <AnimatedBackground />
        <PublicNavbar />
        
        {/* 1. HERO SECTION */}
        <section className="relative px-6 py-8 sm:py-16 max-w-7xl mx-auto text-left w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 z-10">
            <PageEnter.Item delay={0.15}>
              <Badge variant="primary" className="border-primary/30">Live classes coming soon</Badge>
            </PageEnter.Item>
            
            <div className="space-y-2">
              <PageEnter.Item delay={0.25} y={15}>
                <span className="block text-4xl sm:text-5xl lg:text-6xl font-black text-text-main tracking-tight leading-[1.05]">
                  <TextEffect variant="blur-in" per="word" delay={0.1}>Veloria Academy —</TextEffect>
                </span>
              </PageEnter.Item>
              <PageEnter.Item delay={0.30} y={15}>
                <span className="block text-4xl sm:text-5xl lg:text-6xl font-black text-text-main tracking-tight leading-[1.05]">
                  <TextEffect variant="blur-in" per="word" delay={0.1}>Learn practical skills</TextEffect>
                </span>
              </PageEnter.Item>
              <PageEnter.Item delay={0.35} y={15}>
                <span className="block text-4xl sm:text-5xl lg:text-6xl font-black text-text-main tracking-tight leading-[1.05]">
                  <TextEffect variant="blur-in" per="word" delay={0.1}>through books, PDFs,</TextEffect>
                </span>
              </PageEnter.Item>
              <PageEnter.Item delay={0.45} y={15}>
                <span className="block text-4xl sm:text-5xl lg:text-6xl font-black text-text-main tracking-tight leading-[1.05]">
                  <span className="text-secondary underline decoration-primary decoration-4">
                    <TextEffect variant="scale-up" per="char" delay={0.55}>and guided resources</TextEffect>
                  </span>
                </span>
              </PageEnter.Item>
            </div>

            <PageEnter.Item delay={0.45}>
              <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-xl font-normal">
                Veloria Academy helps learners build real-world skills with practical guides, PDF notes, online resources, and beginner-friendly learning paths. Live classes and structured cohorts are coming soon.
              </p>
            </PageEnter.Item>

            <PageEnter.Item delay={0.55} scale={0.97}>
              <div className="flex flex-wrap gap-4 pt-2">
                <MagneticButton>
                  <Button size="lg" onClick={() => { trackEvent('page_view_manual', { metadata: { clicked: 'browse_library' } }); navigate('/courses'); }} className="watermelon-card-glow-pink">
                    Explore Library
                  </Button>
                </MagneticButton>
                <MagneticButton>
                  <Button size="lg" variant="outline" onClick={() => { document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' }) }} className="border-border hover:border-secondary transition-colors">
                    Join Waitlist
                  </Button>
                </MagneticButton>
              </div>
            </PageEnter.Item>
            
            <div className="pt-6 border-t border-border flex flex-wrap items-center gap-6 text-xs text-text-subtle font-bold uppercase tracking-wider overflow-hidden">
              <PageEnter.Item delay={0.65} className="inline-block" y={10}>
                <span>✓ Practical PDF resources</span>
              </PageEnter.Item>
              <PageEnter.Item delay={0.75} className="inline-block" y={10}>
                <span>✓ Beginner-friendly guides</span>
              </PageEnter.Item>
              <PageEnter.Item delay={0.85} className="inline-block" y={10}>
                <span>✓ Live classes coming soon</span>
              </PageEnter.Item>
            </div>
          </div>

          {/* Live Learners Count & Dashboard Preview mockup with Orbiting Skills background */}
          <div className="lg:col-span-5 w-full flex flex-col gap-6 relative items-center justify-center min-h-[380px] sm:min-h-[440px]">
            {/* Motion Primitives: Orbiting Circles backdrop */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-50 pointer-events-none scale-90 sm:scale-100">
              <OrbitingCircles speedMultiplier={0.75} innerRadius={90} outerRadius={150}>
                {/* Inner track items */}
                <div className="p-2 bg-surface border border-primary/20 text-primary rounded-full shadow-sm"><Code className="h-4.5 w-4.5" /></div>
                <div className="p-2 bg-surface border border-secondary/20 text-secondary rounded-full shadow-sm"><Database className="h-4.5 w-4.5" /></div>
                <div className="p-2 bg-surface border border-primary/20 text-primary rounded-full shadow-sm"><Palette className="h-4.5 w-4.5" /></div>
                <div className="p-2 bg-surface border border-secondary/20 text-secondary rounded-full shadow-sm"><Smartphone className="h-4.5 w-4.5" /></div>
                
                {/* Outer track items */}
                <div className="p-2 bg-surface border border-secondary/20 text-secondary rounded-full shadow-sm"><Zap className="h-4.5 w-4.5" /></div>
                <div className="p-2 bg-surface border border-primary/20 text-primary rounded-full shadow-sm"><BookOpen className="h-4.5 w-4.5" /></div>
                <div className="p-2 bg-surface border border-secondary/20 text-secondary rounded-full shadow-sm"><ShieldCheck className="h-4.5 w-4.5" /></div>
                <div className="p-2 bg-surface border border-primary/20 text-primary rounded-full shadow-sm"><Award className="h-4.5 w-4.5" /></div>
              </OrbitingCircles>
            </div>
            
            <PageEnter.Item delay={0.7} scale={0.95} duration={0.85} className="w-full z-10">
              <AnimatedBentoPreview />
            </PageEnter.Item>
            <PageEnter.Item delay={1.1} y={15} duration={0.85} className="w-full z-10">
              <LiveLearnersCard />
            </PageEnter.Item>
          </div>
        </section>

        {/* Motion Primitives: Infinite Slider logo/feature marquee */}
        <div className="py-6 bg-surface-muted/20 border-y border-border overflow-hidden w-full backdrop-blur-[2px]">
          <InfiniteSlider speed={35} gap={56}>
            <span className="text-xs font-black uppercase tracking-widest text-text-subtle/50 flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" /> React & Vite
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-text-subtle/50 flex items-center gap-2">
              <Database className="h-4 w-4 text-secondary" /> MongoDB Schema
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-text-subtle/50 flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" /> Figma Components
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-text-subtle/50 flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-secondary" /> Mobile Native
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-text-subtle/50 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" /> Node APIs
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-text-subtle/50 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-secondary" /> Authentication
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-text-subtle/50 flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" /> Validated Portals
            </span>
          </InfiniteSlider>
        </div>

        {/* 2. SEARCH & CATS SECTION */}
        <section className="bg-bg-elevated/40 border-b border-border/80 py-12 px-6 w-full">
          <div className="max-w-7xl mx-auto space-y-8">
            <ScrollReveal direction="up">
              <div className="max-w-xl mx-auto text-center space-y-4">
                <h2 className="text-2xl font-black text-text-main">
                  <TextEffect variant="blur-in" per="word">What do you want to learn today?</TextEffect>
                </h2>
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                  <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search Python, React, UI/UX..." />
                  <Button type="submit" className="watermelon-card-glow-pink">Search</Button>
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
                      className="flex items-center gap-3.5 p-4 bg-surface border border-border text-left cursor-pointer hover:border-secondary watermelon-card-glow-green"
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

        {/* Haikei SVG Wave Transition */}
        <HaikeiWaves variant="bottom" className="opacity-80" />

        {/* 3. BENTO FEATURE GRID */}
        <section className="bento-feature-grid-sec px-6 py-16 sm:py-24 max-w-7xl mx-auto w-full text-left space-y-10">
          <ScrollReveal direction="up">
            <div className="max-w-xl text-left space-y-2">
              <Badge variant="secondary" className="border-secondary/35">Platform Features</Badge>
              <h2 className="text-3xl font-black tracking-tight text-text-main">
                <TextEffect variant="blur-in" per="word">Structured Bento Modules</TextEffect>
              </h2>
            </div>
          </ScrollReveal>

          {/* Anime.js: Center out staggered viewport reveal */}
          <AnimeStaggerGrid columns={3} delay={150}>
            <div className="md:col-span-2 h-full">
              <BentoFeatureCard
                title="Interactive Syllabus Player"
                description="Collapsible split-screen course player loaded with resource attachments, code cheat sheets, and notebook sync tools."
                icon={<BookOpen className="h-6 w-6" />}
                badge="Premium"
                className="h-full hover:border-primary watermelon-card-glow-pink"
              />
            </div>
            <div className="h-full">
              <BentoFeatureCard
                title="WCAG 2.2 Standard"
                description="Full keyboard focus states, high contrast text variables, and accessible labels built from day one."
                icon={<ShieldCheck className="h-6 w-6" />}
                className="h-full hover:border-secondary watermelon-card-glow-green"
              />
            </div>
            <div className="h-full">
              <BentoFeatureCard
                title="Instant Certificate Generation"
                description="Achieve 100% curriculum completion and pass final quizzes to unlock public credential validation codes."
                icon={<Award className="h-6 w-6" />}
                className="h-full hover:border-secondary watermelon-card-glow-green"
              />
            </div>
            <div className="md:col-span-2 h-full">
              <BentoFeatureCard
                title="Local Simulation Mode"
                description="State structures persisted entirely in LocalStorage for lightning fast offline validation before cloud deployment."
                icon={<Zap className="h-6 w-6" />}
                badge="Offline"
                className="h-full hover:border-primary watermelon-card-glow-pink"
              />
            </div>
          </AnimeStaggerGrid>
        </section>

        {/* Haikei SVG Wave Transition */}
        <HaikeiWaves variant="top" className="opacity-80" />

        {/* 4. POPULAR COURSES PREVIEW */}
        <section className="popular-courses-sec bg-bg-elevated/40 border-y border-border py-16 sm:py-24 px-6 w-full text-left">
          <div className="max-w-7xl mx-auto space-y-10">
            <ScrollReveal direction="up">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-2">
                  <Badge variant="success" className="border-success/35">Active Catalog</Badge>
                  <h2 className="text-3xl font-black tracking-tight text-text-main">Popular Courses</h2>
                </div>
                <Button variant="outline" onClick={() => navigate('/courses')} className="hover:border-primary transition-colors">
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
              <Badge variant="primary" className="border-primary/35">Reviews</Badge>
              <h2 className="text-3xl font-black text-text-main tracking-tight">Loved by Learners</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockTestimonials.map((test, idx) => (
              <div key={idx} className="testimonial-card-gsap">
                <Card className="bg-surface border border-border p-6 flex flex-col justify-between h-full hover:border-secondary watermelon-card-glow-green transition-all">
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
        <section className="pricing-cards-sec bg-bg-elevated/40 border-y border-border py-16 px-6 w-full text-center">
          <div className="max-w-7xl mx-auto space-y-10">
            <ScrollReveal direction="up">
              <div className="max-w-xl mx-auto space-y-2">
                <Badge variant="secondary" className="border-secondary/35">Simple Plans</Badge>
                <h2 className="text-3xl font-black text-text-main tracking-tight">Flexible Pricing</h2>
                <p className="text-xs text-text-subtle font-semibold">Start learning for free and upgrade as your developer career grows.</p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
              {/* Free */}
              <div className="h-full pricing-card-gsap">
                <Card className="bg-surface border border-border p-6 flex flex-col justify-between h-full hover:border-primary watermelon-card-glow-pink">
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
                    <Button variant="outline" className="w-full hover:border-secondary transition-colors" onClick={() => { trackPricingCtaClick('free'); navigate(getStartedPath); }}>
                      Join Platform
                    </Button>
                  </MagneticButton>
                </Card>
              </div>
              
              {/* Pro */}
              <div className="h-full pricing-card-gsap">
                <Card className="bg-surface border border-secondary p-6 flex flex-col justify-between h-full relative watermelon-card-glow-green watermelon-border-gradient">
                  <Badge variant="secondary" className="absolute top-3 right-3 border-secondary/35 bg-secondary/10 text-secondary z-10">Popular</Badge>
                  <div className="space-y-4 z-10">
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
                  <MagneticButton className="w-full mt-8 z-10">
                    <Button variant="primary" className="w-full watermelon-card-glow-pink" onClick={() => { trackPricingCtaClick('pro'); navigate('/pricing'); }}>
                      Upgrade Pro
                    </Button>
                  </MagneticButton>
                </Card>
              </div>

              {/* Unlimited */}
              <div className="h-full pricing-card-gsap">
                <Card className="bg-surface border border-border p-6 flex flex-col justify-between h-full hover:border-primary watermelon-card-glow-pink">
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
                    <Button variant="outline" className="w-full hover:border-secondary transition-colors" onClick={() => { trackPricingCtaClick('enterprise'); navigate('/contact'); }}>
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
                  title: 'Is Veloria Academy completely frontend-only?',
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

        {/* CTA sections with morphing background blobs */}
        <section className="footer-promo-sec bg-surface-muted/25 border-y border-border py-16 px-6 text-center w-full relative overflow-hidden">
          {/* Background Morphing Blobs */}
          <div className="absolute right-[-10%] top-[-25%] w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] opacity-15 pointer-events-none -z-10">
            <AnimeBlobMorph duration={9000} />
          </div>
          <div className="absolute left-[-10%] bottom-[-25%] w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] opacity-15 pointer-events-none -z-10 rotate-90">
            <AnimeBlobMorph duration={12000} />
          </div>

          <div className="footer-promo-gsap max-w-xl mx-auto space-y-5 z-10">
            <h2 className="text-2xl sm:text-3xl font-black text-text-main">Ready to share your expertise?</h2>
            <p className="text-xs text-text-muted">Create instructor accounts, build courses using the syllabus visual outline tool, and track enrolled student progress.</p>
            <div className="flex justify-center gap-3">
              <MagneticButton>
                <Button variant="secondary" onClick={() => navigate('/signup?role=instructor')} className="watermelon-card-glow-pink">
                  Apply as Instructor
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button variant="outline" onClick={() => navigate('/about')} className="hover:border-secondary transition-colors">
                  Learn More
                </Button>
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
      <SEO 
        title="Learning Library — Veloria Academy" 
        description="Explore practical courses in AI, product building, content creation, engineering, and modern digital skills."
        canonical="/courses"
      />
      <div className="flex flex-col min-h-screen bg-bg relative overflow-hidden">
        <AnimatedBackground />
        <PublicNavbar />
        <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 w-full text-left">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-black text-text-main tracking-tight">Learning Library</h1>
              <p className="text-xs text-text-muted mt-1">Read practical books, PDF notes, and guided resources online. Live classes are coming soon.</p>
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
                title="No Resources Found" 
                description="No matches found in the library. Try resetting search strings or category filters."
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

  useEffect(() => {
    if (course && !loading) {
      trackCourseDetailView(course.id);
    }
  }, [course?.id, loading]);

  const handleEnroll = async () => {
    if (!course) return;
    trackEnrollClick(course.id);
    
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

  const courseStructuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description,
    "provider": {
      "@type": "Organization",
      "name": "Veloria Academy",
      "sameAs": "https://course-website-pages.kalthiyaheet.workers.dev"
    }
  };

  return (
    <PageTransition>
      <SEO 
        title={`${course.title} — Veloria Academy`}
        description={course.description}
        canonical={`/course/${course.id}`}
        ogType="course"
        structuredData={courseStructuredData}
      />
      <div className="flex flex-col min-h-screen bg-bg relative overflow-hidden">
        <AnimatedBackground />
        <PublicNavbar />
        
        <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 w-full text-left">
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
                  What you will learn
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
                      <li className="flex gap-2"><Check className="h-4.5 w-4.5 text-success flex-shrink-0" /> Practical insights</li>
                      <li className="flex gap-2"><Check className="h-4.5 w-4.5 text-success flex-shrink-0" /> High-quality materials</li>
                      <li className="flex gap-2"><Check className="h-4.5 w-4.5 text-success flex-shrink-0" /> Self-paced learning</li>
                    </>
                  )}
                </ul>
              </Card>
  
              {/* Curriculum section list preview */}
              <Card className="bg-surface border border-border p-6 text-left">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base font-extrabold text-text-main uppercase tracking-wider">
                      Table of Contents
                    </h3>
                    <span className="text-[10px] text-text-subtle font-semibold">
                      {course.modules?.length || 0} Chapters
                    </span>
                  </div>
                </div>
  
                <div className="space-y-3">
                  {course.modules?.map((mod) => (
                    <div 
                      key={mod.id}
                      className="flex items-center justify-between p-3.5 bg-surface-muted/50 border border-border/65 rounded-ctrl text-xs font-semibold"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-3.5 w-3.5 text-secondary flex-shrink-0" />
                        <span className="text-text-muted">{mod.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
  
            {/* Right details sidebar actions */}
            <div className="lg:col-span-4 space-y-6">
              {/* Pricing access card */}
              {/* Live Classes Waitlist card */}
              <Card className="bg-surface border border-border p-6 text-left space-y-5">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-text-muted font-bold">Live Classes</span>
                  <span className="text-xl font-black text-text-main">
                    Coming Soon
                  </span>
                  <p className="text-xs text-text-muted mt-2">Live classes and interactive cohorts for this topic are coming soon. Join the waitlist to be notified.</p>
                </div>
                <WaitlistForm sourcePage={`Resource: ${course.title}`} />
              </Card>
  
              {/* Instructor card */}
              <Card className="bg-surface border border-border p-5 text-center space-y-4">
                <h4 className="text-xs font-bold text-text-subtle uppercase tracking-wider">Author</h4>
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
      <SEO 
        title="Pricing — Veloria Academy"
        description="Choose a learning plan that fits your goals and start building practical skills."
        canonical="/pricing"
      />
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
                  <Button variant="outline" className="w-full" onClick={() => { trackPricingCtaClick('free'); navigate('/signup'); }}>
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
                  <Button variant="primary" className="w-full" onClick={() => { trackPricingCtaClick('pro'); navigate('/signup?tier=pro'); }}>
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
                  <Button variant="outline" className="w-full" onClick={() => { trackPricingCtaClick('enterprise'); navigate('/contact'); }}>
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
      <SEO 
        title="About Veloria Academy"
        description="Learn about Veloria Academy and our mission to make practical skill-based learning accessible."
        canonical="/about"
      />
      <div className="flex flex-col min-h-screen bg-bg relative overflow-hidden">
        <AnimatedBackground />
        <PublicNavbar />
        <div className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full text-left space-y-10">
          <ScrollReveal direction="up">
            <div className="space-y-2">
              <Badge variant="primary">Our Story</Badge>
              <h1 className="text-3xl font-black text-text-main tracking-tight">About Veloria Academy</h1>
              <p className="text-xs text-text-muted">An educational platform designed for readability, clean spacing, and offline durability.</p>
            </div>
          </ScrollReveal>
  
          <ScrollReveal direction="up" delay={0.2}>
            <Card className="p-6 bg-surface border border-border leading-relaxed text-sm text-text-muted space-y-4">
              <p>
                Veloria Academy was conceptualized to address modern education portal fatigue. Too often, learning tools are clogged with slow API bundles, distracting layouts, and inconsistent user experiences.
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
import { mockApi } from '../lib/api';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [msg, setMsg] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>();
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !msg) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    
    try {
      await mockApi.submitContact({
        name, email, subject, message: msg, turnstileToken
      });
      trackContactSuccess();
      setSent(true);
      setName('');
      setEmail('');
      setSubject('');
      setMsg('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <SEO 
        title="Contact Veloria Academy"
        description="Contact Veloria Academy for course questions, support, partnerships, and feedback."
        canonical="/contact"
      />
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
                    {errorMsg && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-xs font-medium">
                        {errorMsg}
                      </div>
                    )}
                    <Input label="Name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required disabled={loading} />
                    <Input label="Email address" type="email" placeholder="john@company.com" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
                    <Input label="Subject" placeholder="How can we help?" value={subject} onChange={e => setSubject(e.target.value)} required disabled={loading} />
                    <Textarea label="Message" placeholder="Type your query..." value={msg} onChange={e => setMsg(e.target.value)} required disabled={loading} />
                    
                    {siteKey && (
                      <div className="pt-2">
                        <Turnstile 
                          siteKey={siteKey} 
                          onSuccess={(token) => setTurnstileToken(token)}
                          onError={() => setErrorMsg('Security check failed. Please refresh the page.')}
                        />
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <Button type="submit" className="w-full" disabled={loading || (siteKey && !turnstileToken)} icon={!loading && <Send className="h-4 w-4" />}>
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>
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
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What credentials do I use to view the Student, Instructor, and Admin dashboards?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Click Log In. Log in with (student@thelearningcollective.com / student123) for student views, (instructor@thelearningcollective.com / instructor123) for instructor course designer views, or (admin@thelearningcollective.com / admin123) for user moderation queues."
        }
      },
      {
        "@type": "Question",
        "name": "Are final course certificates verified?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Every generated certificate records unique ID strings (e.g. Veloria Academy-CERT-xxxx-xxxxxx) that map directly to our user database. Students print or save certificates to PDF directly from their Certificate tab."
        }
      },
      {
        "@type": "Question",
        "name": "How does local database replication work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "On the first mount, the application checks localStorage. If empty, it populates it with verified courses, syllabus structures, and dummy user profiles. Progress checkboxes and new courses save to localStorage immediately."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a dark mode option available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, the portal includes dark mode toggles inside the top header of all Student, Instructor, and Admin dashboard pages, adapting color variables to dark charcoal surfaces."
        }
      }
    ]
  };

  return (
    <PageTransition>
      <SEO 
        title="FAQ — Veloria Academy"
        description="Find answers about courses, enrollment, certificates, accounts, and learning support."
        canonical="/faq"
        structuredData={faqStructuredData}
      />
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
                  content: 'Yes! Every generated certificate records unique ID strings (e.g. Veloria Academy-CERT-xxxx-xxxxxx) that map directly to our user database. Students print or save certificates to PDF directly from their Certificate tab.'
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

export const TermsPage: React.FC = () => {
  return (
    <PageTransition>
      <SEO title="Terms of Service — Veloria Academy" />
      <div className="flex flex-col min-h-screen bg-bg">
        <PublicNavbar />
        <main className="flex-grow max-w-4xl mx-auto px-6 py-24 text-left">
          <h1 className="text-3xl font-black text-text-main mb-6">Terms of Service</h1>
          <p className="text-text-muted leading-relaxed mb-4">Effective Date: {new Date().getFullYear()}</p>
          <div className="space-y-6 text-sm text-text-muted leading-relaxed">
            <p>Welcome to Veloria Academy. By accessing or using our platform, website, or services, you agree to be bound by these Terms of Service. If you do not agree to all of the terms and conditions, you must not access or use our services.</p>
            
            <h2 className="text-xl font-bold text-text-main mt-8 mb-4">1. Acceptance of Terms & Modifications</h2>
            <p>By using our services, you confirm that you accept these terms of use and that you agree to comply with them. We reserve the right to update, change, or replace any part of these Terms of Service at our sole discretion without prior notice. Your continued use of the platform following the posting of any changes constitutes acceptance of those changes.</p>
            
            <h2 className="text-xl font-bold text-text-main mt-8 mb-4">2. Disclaimer of Warranties; "AS-IS" Basis</h2>
            <p className="uppercase font-bold text-text-main">THE SERVICES AND ALL INCLUDED CONTENT ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTY OF ANY KIND, WHETHER EXPRESS OR IMPLIED.</p>
            <p>Veloria Academy specifically disclaims any and all warranties and conditions of merchantability, fitness for a particular purpose, and non-infringement, and any warranties arising out of course of dealing or usage of trade. We make no warranty that the services will meet your requirements or be available on an uninterrupted, secure, or error-free basis. We make no warranty regarding the quality, accuracy, timeliness, truthfulness, completeness, or reliability of any content.</p>
            
            <h2 className="text-xl font-bold text-text-main mt-8 mb-4">3. Limitation of Liability</h2>
            <p className="uppercase font-bold text-text-main">IN NO EVENT SHALL VELORIA ACADEMY, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES WHATSOEVER.</p>
            <p>This includes, without limitation, damages resulting from: (1) errors, mistakes, or inaccuracies of content; (2) personal injury or property damage, of any nature whatsoever, resulting from your access to and use of our services; (3) any unauthorized access to or use of our secure servers and/or any and all personal information stored therein; (4) any interruption or cessation of transmission to or from our services; (5) any bugs, viruses, trojan horses, or the like, which may be transmitted to or through our services by any third party; and/or (6) any errors or omissions in any content or for any loss or damage of any kind incurred as a result of your use of any content posted, emailed, transmitted, or otherwise made available via the services, whether based on warranty, contract, tort, or any other legal theory, and whether or not the company is advised of the possibility of such damages.</p>

            <h2 className="text-xl font-bold text-text-main mt-8 mb-4">4. Indemnification</h2>
            <p>You agree to defend, indemnify, and hold harmless Veloria Academy, its parent corporation, officers, directors, employees and agents, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees) arising from: (i) your use of and access to the Service; (ii) your violation of any term of these Terms of Service; (iii) your violation of any third party right, including without limitation any copyright, property, or privacy right; or (iv) any claim that your content caused damage to a third party. This defense and indemnification obligation will survive these Terms of Service and your use of the Service.</p>
            
            <h2 className="text-xl font-bold text-text-main mt-8 mb-4">5. User Account and Security</h2>
            <p>To use certain features of our platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are entirely responsible for maintaining the confidentiality of your password and account. Furthermore, you are entirely responsible for any and all activities that occur under your account.</p>
            
            <h2 className="text-xl font-bold text-text-main mt-8 mb-4">6. Third-Party Links and Resources</h2>
            <p>The Service may contain links to third-party websites or services that are not owned or controlled by Veloria Academy. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party websites or services. You further acknowledge and agree that Veloria Academy shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.</p>

            <h2 className="text-xl font-bold text-text-main mt-8 mb-4">7. Termination</h2>
            <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms. If you wish to terminate your account, you may simply discontinue using the Service. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>

            <h2 className="text-xl font-bold text-text-main mt-8 mb-4">8. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.</p>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <PageTransition>
      <SEO title="Privacy Policy — Veloria Academy" />
      <div className="flex flex-col min-h-screen bg-bg">
        <PublicNavbar />
        <main className="flex-grow max-w-4xl mx-auto px-6 py-24 text-left">
          <h1 className="text-3xl font-black text-text-main mb-6">Privacy Policy</h1>
          <p className="text-text-muted leading-relaxed mb-4">Effective Date: {new Date().getFullYear()}</p>
          <div className="space-y-6 text-sm text-text-muted leading-relaxed">
            <p>At Veloria Academy, we prioritize transparency. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, platform, and associated services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>
            
            <h2 className="text-xl font-bold text-text-main mt-8 mb-4">1. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information that you voluntarily give to us when you register with the Site.</li>
              <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
              <li><strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services.</li>
            </ul>

            <h2 className="text-xl font-bold text-text-main mt-8 mb-4">2. Use of Your Information</h2>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Create and manage your account.</li>
              <li>Process your transactions and send you related information, including purchase confirmations and invoices.</li>
              <li>Resolve disputes and troubleshoot problems.</li>
              <li>Respond to product and customer service requests.</li>
              <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Site to you.</li>
              <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
            </ul>

            <h2 className="text-xl font-bold text-text-main mt-8 mb-4">3. Disclosure of Your Information</h2>
            <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
              <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
              <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            </ul>

            <h2 className="text-xl font-bold text-text-main mt-8 mb-4">4. Data Security</h2>
            <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse. Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. Therefore, we cannot guarantee complete security if you provide personal information.</p>

            <h2 className="text-xl font-bold text-text-main mt-8 mb-4">5. Disclaimer of Liability</h2>
            <p className="uppercase font-bold text-text-main">TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WE DO NOT ASSUME ANY RESPONSIBILITY OR LIABILITY FOR ANY LOSS, DAMAGE, OR UNAUTHORIZED ACCESS TO OR USE OF YOUR PERSONAL INFORMATION.</p>
            <p>You acknowledge that you provide your personal information at your own risk. By using the platform, you expressly agree that Veloria Academy shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from the unauthorized access, use, or disclosure of your personal data.</p>
            
            <h2 className="text-xl font-bold text-text-main mt-8 mb-4">6. Cookies and Tracking Technologies</h2>
            <p>We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.</p>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};
