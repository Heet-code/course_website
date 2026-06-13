import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { BookOpen, User, Award, CheckCircle2, Users, ArrowUpRight } from 'lucide-react';

export const AnimatedBentoPreview: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax values — all hooks called unconditionally at the top level
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Derived transforms — always created, but only driven by mouse movement when allowed
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const translateX = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);
  const translateY = useTransform(smoothY, [-0.5, 0.5], [-15, 15]);
  const badgeX = useTransform(smoothX, [-0.5, 0.5], [-25, 25]);
  const badgeY = useTransform(smoothY, [-0.5, 0.5], [-25, 25]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion || !containerRef.current) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const rect = containerRef.current.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(normX);
    mouseY.set(normY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const animated = !prefersReducedMotion;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-square md:aspect-[4/3] max-w-[580px] mx-auto flex items-center justify-center rounded-overlay overflow-hidden border border-border bg-surface-muted/30 p-4 sm:p-8"
      style={{ perspective: 1200 }}
    >
      {/* Background soft pastel radial blobs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full filter blur-3xl opacity-30 pointer-events-none"
        style={{ backgroundColor: '#FAD4C0' }}
        animate={animated ? {
          scale: [1, 1.2, 0.9, 1],
          x: [0, 20, -20, 0],
          y: [0, -30, 20, 0],
        } : {}}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full filter blur-3xl opacity-25 pointer-events-none"
        style={{ backgroundColor: '#80A1C1' }}
        animate={animated ? {
          scale: [1.1, 0.85, 1.15, 1.1],
          x: [0, -35, 15, 0],
          y: [0, 20, -35, 0],
        } : {}}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Main Parallax Layout Wrapper */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          rotateX: animated ? rotateX : 0,
          rotateY: animated ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* LAYER 1: MAIN BENTO BOARD BACKDROP */}
        <div
          className="absolute w-5/6 h-5/6 bg-surface border border-border rounded-overlay shadow-2xl p-5 flex flex-col justify-between"
          style={{ transform: 'translateZ(-30px)' }}
        >
          {/* Top Panel Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#FAD4C0' }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#80A1C1' }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#16A34A' }} />
            </div>
            <div className="px-2.5 py-0.5 bg-surface-muted border border-border/60 rounded-full text-[9px] font-bold text-text-subtle uppercase tracking-wider">
              Student Dashboard
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 gap-3.5 pt-4 flex-grow">
            {/* Stats Cell */}
            <div className="p-3 bg-surface-muted/65 border border-border/45 rounded-card flex flex-col justify-between">
              <span className="text-[9px] font-bold text-text-subtle uppercase tracking-wide">Weekly Goal</span>
              <div className="my-2">
                <span className="text-xl font-black text-text-main">1,240</span>
                <span className="text-[10px] text-text-subtle font-bold ml-1">/ 2000 XP</span>
              </div>
              <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden border border-border/30">
                <div className="bg-secondary h-full rounded-full" style={{ width: '62%' }} />
              </div>
            </div>

            {/* Next Up Cell */}
            <div className="p-3 bg-surface-muted/65 border border-border/45 rounded-card space-y-2 text-left">
              <span className="text-[9px] font-bold text-text-subtle uppercase tracking-wide">Next Up</span>
              <div className="flex gap-2 items-start">
                <div className="p-1 bg-secondary/15 rounded text-secondary flex-shrink-0">
                  <BookOpen className="h-3 w-3" />
                </div>
                <div className="min-w-0">
                  <h6 className="text-[10px] font-extrabold text-text-main leading-tight truncate">Advanced Grid Layouts</h6>
                  <span className="text-[8px] text-text-subtle font-semibold">Lesson 3 of 12</span>
                </div>
              </div>
            </div>

            {/* Milestones Cell */}
            <div className="col-span-2 p-3 bg-surface-muted/65 border border-border/45 rounded-card text-left flex flex-col justify-between">
              <span className="text-[9px] font-bold text-text-subtle uppercase tracking-wide mb-1">Module Milestones</span>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[9px] font-semibold text-text-muted">
                  <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0" />
                  <span>Interactive Bento Grid markup</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-semibold text-text-muted">
                  <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0" />
                  <span>Tailwind v4 layout compiler setup</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-semibold text-text-subtle">
                  <div className="h-2.5 w-2.5 rounded-full border border-border/80 flex-shrink-0" />
                  <span>Subtle cursor magnetic springs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LAYER 2: FLOATING COURSE CARD */}
        <motion.div
          className="absolute -top-3 sm:-top-6 right-[4%] w-[210px] sm:w-[240px] bg-surface border-2 border-border-strong rounded-overlay p-4 shadow-2xl text-left"
          style={{
            transform: 'translateZ(40px)',
            rotateX: animated ? rotateX : 0,
            rotateY: animated ? rotateY : 0,
            x: animated ? translateX : 0,
            y: animated ? translateY : 0,
          }}
          animate={animated ? { y: [-6, 6, -6] } : {}}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="relative aspect-video rounded-card bg-surface-muted border border-border/40 overflow-hidden mb-3 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary/15 to-primary/25" />
            <div className="p-2.5 bg-surface rounded-full shadow-sm text-secondary z-10">
              <Award className="h-5 w-5" />
            </div>
            <span className="absolute bottom-1.5 left-1.5 text-[8px] font-bold bg-success text-white py-0.5 px-1.5 rounded-full flex items-center gap-1 leading-none">
              <span className="h-1 w-1 rounded-full bg-white animate-pulse" /> Certified
            </span>
          </div>

          <span className="text-[8px] font-black text-secondary uppercase tracking-wider block">Course Active</span>
          <h5 className="text-[11px] sm:text-xs font-black text-text-main mt-0.5 mb-1.5 leading-snug">
            SaaS Dashboard Design
          </h5>

          <div className="flex items-center justify-between text-[9px] text-text-subtle font-bold uppercase mb-1">
            <span>Progress</span>
            <span className="text-text-main">85% Completed</span>
          </div>

          <div className="w-full bg-surface-muted h-1.5 rounded-full overflow-hidden border border-border/30">
            <motion.div
              className="bg-secondary h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
            />
          </div>

          <div className="flex items-center gap-1.5 text-[9px] text-text-subtle font-semibold mt-3 pt-2.5 border-t border-border/45">
            <User className="h-3 w-3 text-secondary" />
            <span>Instructor: Prof. Bento</span>
          </div>
        </motion.div>

        {/* LAYER 3: FLOATING LIVE LEARNERS BADGE */}
        <motion.div
          className="absolute -bottom-3 sm:-bottom-6 left-[2%] bg-surface border border-border-strong rounded-overlay p-3.5 shadow-xl flex items-center gap-3 text-left"
          style={{
            transform: 'translateZ(70px)',
            x: animated ? badgeX : 0,
            y: animated ? badgeY : 0,
          }}
          animate={animated ? { y: [5, -5, 5] } : {}}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <div className="p-2.5 bg-success/10 text-success rounded-card flex-shrink-0 relative">
            <Users className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success border-2 border-surface animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success border-2 border-surface" />
          </div>

          <div>
            <span className="text-[8px] font-black text-text-subtle uppercase tracking-wider block">Live Presence</span>
            <span className="text-xs font-black text-text-main leading-none flex items-center gap-1.5 mt-0.5">
              1,240 Online
            </span>
            <div className="flex items-center -space-x-1.5 mt-1">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50" alt="Avatar" className="h-3.5 w-3.5 rounded-full border border-surface object-cover" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50" alt="Avatar" className="h-3.5 w-3.5 rounded-full border border-surface object-cover" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50" alt="Avatar" className="h-3.5 w-3.5 rounded-full border border-surface object-cover" />
              <div className="h-3.5 w-3.5 rounded-full bg-secondary text-[7px] font-black text-white flex items-center justify-center border border-surface select-none">
                +8
              </div>
            </div>
          </div>
        </motion.div>

        {/* LAYER 4: DECORATIVE MINI TAG */}
        <motion.div
          className="absolute -right-4 bottom-1/4 bg-surface border border-border rounded-full py-1.5 px-3 shadow-lg flex items-center gap-1.5 text-[9px] font-black text-text-main pointer-events-none"
          style={{ transform: 'translateZ(50px)' }}
          animate={animated ? {
            y: [-3, 3, -3],
            x: [3, -3, 3],
          } : {}}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#FAD4C0' }} />
          <span>Tailwind v4 Ready</span>
          <ArrowUpRight className="h-3 w-3 text-secondary" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AnimatedBentoPreview;
