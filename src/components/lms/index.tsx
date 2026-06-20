import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, Clock, BookOpen, User, Play, CheckCircle2, 
  FileText, Download, Award, Plus, Trash2, ArrowLeft, ArrowRight, Send, Check
} from 'lucide-react';
import { Course, Module, Lesson, Quiz, Certificate } from '../../types';
import { Card, Badge, Button, ProgressBar, Input, Textarea, Select } from '../ui';
import { CourseReaction } from '../playhtml/CourseReaction';
import { ScrollReveal } from '../animations/ScrollReveal';
import { trackCourseClick, trackCertificateGenerate } from '../../lib/analytics';

// ==========================================
// 1. COURSE CARD
// ==========================================
interface CourseCardProps {
  course: Course;
  progress?: number;
  enrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, progress, enrolled = false }) => {
  const navigate = useNavigate();
  
  const ratingStars = Array.from({ length: 5 }).map((_, idx) => (
    <Star
      key={idx}
      className={`h-3.5 w-3.5 ${
        idx < Math.floor(course.rating)
          ? 'text-warning fill-warning'
          : 'text-text-disabled'
      }`}
    />
  ));

  const difficultyColors = {
    Beginner: 'primary' as const,
    Intermediate: 'secondary' as const,
    Advanced: 'danger' as const
  };

  const handleCardClick = () => {
    trackCourseClick(course.id);
    if (enrolled) {
      navigate(`/course/${course.id}/learn`);
    } else {
      navigate(`/course/${course.id}`);
    }
  };

  return (
    <Card 
      onClick={handleCardClick}
      className="flex flex-col h-full bg-surface border border-border text-left overflow-hidden group focus-within:ring-2 focus-within:ring-secondary focus-within:ring-offset-2 outline-none cursor-pointer hover:-translate-y-1 hover:shadow-md hover:border-secondary transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full rounded-ctrl overflow-hidden mb-4 bg-surface-muted border border-border/50">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5">
          <Badge variant={course.isFree ? 'success' : 'neutral'} className="shadow-sm">
            {course.isFree ? 'Free' : (
              <span className="flex items-center gap-1">
                {course.originalPrice && <span className="line-through opacity-60 text-[10px] font-normal mr-1">${course.originalPrice}</span>}
                <span className="font-extrabold">${course.price}</span>
              </span>
            )}
          </Badge>
        </div>
      </div>

      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
        <Badge variant="secondary" className="text-[10px] py-0 px-2 font-bold uppercase tracking-wider">
          {course.category}
        </Badge>
        <Badge variant={difficultyColors[course.difficulty] || 'neutral'} className="text-[10px] py-0 px-2 font-bold uppercase tracking-wider">
          {course.difficulty}
        </Badge>
        <span className="flex items-center gap-1 text-[11px] text-text-subtle font-bold uppercase tracking-wider ml-auto">
          <Clock className="h-3.5 w-3.5 text-secondary" /> {course.duration}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-extrabold text-text-main mb-2 line-clamp-2 min-h-[40px] group-hover:text-secondary transition-colors">
        {course.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-text-muted line-clamp-2 mb-4 leading-relaxed font-semibold">
        {course.shortDescription || course.description}
      </p>

      <div className="mt-auto space-y-3.5">
        {/* Rating and Enrolled Count */}
        <div className="flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-1 font-bold">
            <div className="flex mr-0.5">{ratingStars}</div>
            <span className="text-text-main">{course.rating || 'N/A'}</span>
          </div>
          <span className="font-semibold">{course.enrolledCount} enrolled</span>
        </div>

        {/* Progress Bar (Enrolled Only) */}
        {enrolled && progress !== undefined && (
          <div className="pt-1">
            <ProgressBar progress={progress} />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2.5 border-t border-border/50">
          <span className="text-[11px] font-bold text-text-subtle flex items-center gap-1.5 truncate mr-2">
            <User className="h-3.5 w-3.5 text-secondary flex-shrink-0" /> {course.instructorName}
          </span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <CourseReaction courseId={course.id} />
            <Button 
              variant={enrolled ? 'secondary' : 'outline'} 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              {enrolled ? 'Resume' : 'Details'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// ==========================================
// 2. COURSE GRID
// ==========================================
interface CourseGridProps {
  courses: Course[];
  enrollments?: { [courseId: string]: number };
  disableReveal?: boolean;
}

export const CourseGrid: React.FC<CourseGridProps> = ({ courses, enrollments, disableReveal = false }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, idx) => {
        const cardContent = (
          <CourseCard 
            course={course} 
            enrolled={enrollments ? enrollments[course.id] !== undefined : false}
            progress={enrollments ? enrollments[course.id] : undefined}
          />
        );

        if (disableReveal) {
          return (
            <div key={course.id} className="course-card-gsap">
              {cardContent}
            </div>
          );
        }

        return (
          <ScrollReveal key={course.id} direction="up" delay={(idx % 3) * 0.1} className="course-card-gsap">
            {cardContent}
          </ScrollReveal>
        );
      })}
    </div>
  );
};

// ==========================================
// 3. COURSE HERO
// ==========================================
interface CourseHeroProps {
  course: Course;
  enrolled: boolean;
  progress?: number;
  onEnroll: () => void;
  loadingEnroll?: boolean;
}

export const CourseHero: React.FC<CourseHeroProps> = ({ 
  course, 
  enrolled, 
  progress = 0, 
  onEnroll, 
  loadingEnroll = false 
}) => {
  return (
    <div className="relative rounded-overlay border border-border bg-surface p-6 sm:p-8 overflow-hidden text-left mb-8 flex flex-col md:flex-row gap-8 items-center">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      {/* Info Column */}
      <div className="flex-1 space-y-4">
        <div className="flex flex-wrap items-center gap-2 w-full">
          <Badge variant="secondary">{course.category}</Badge>
          <Badge variant={course.difficulty === 'Advanced' ? 'danger' : course.difficulty === 'Intermediate' ? 'secondary' : 'primary'}>
            {course.difficulty}
          </Badge>
          {course.certificateAvailable && (
            <Badge variant="success">Certificate Available</Badge>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight leading-tight">
          {course.title}
        </h1>

        <p className="text-sm text-text-muted leading-relaxed max-w-3xl">
          {course.description}
        </p>

        {/* Course specs list */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-text-subtle font-bold uppercase">
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-secondary" /> Duration: {course.duration}</span>
          <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-warning fill-warning" /> Rating: {course.rating} / 5.0</span>
          <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-secondary" /> Instructor: {course.instructorName}</span>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
          {enrolled ? (
            <div className="w-full sm:max-w-xs space-y-2">
              <ProgressBar progress={progress} />
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={onEnroll}
              >
                Resume Syllabus Player
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-left">
                <span className="text-xs font-bold text-text-subtle block uppercase tracking-wider">Tuition Fee</span>
                <span className="text-2xl font-black text-text-main">
                  {course.isFree ? 'FREE' : `$${course.price?.toFixed(2)}`}
                </span>
              </div>
              <Button 
                variant="primary" 
                size="lg"
                loading={loadingEnroll}
                onClick={onEnroll}
              >
                {course.isFree ? 'Register Free' : 'Purchase Access'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Column */}
      <div className="w-full md:w-80 lg:w-96 aspect-video rounded-card border border-border overflow-hidden shadow-sm flex-shrink-0 bg-surface-muted">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

// ==========================================
// 4. LESSON PLAYER
// ==========================================
interface LessonPlayerProps {
  lesson: Lesson;
  onToggleComplete: () => void;
  isCompleted: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lesson,
  onToggleComplete,
  isCompleted,
  onPrev,
  onNext
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'resources' | 'notes'>('content');
  const [noteText, setNoteText] = useState('');
  const [notesList, setNotesList] = useState<string[]>([]);

  useEffect(() => {
    setNoteText('');
    setNotesList([]);
  }, [lesson.id]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setNotesList([...notesList, noteText.trim()]);
    setNoteText('');
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full">
      {/* Video Container */}
      <div className="relative aspect-video w-full bg-black rounded-card overflow-hidden shadow border border-border flex items-center justify-center">
        <video 
          key={lesson.videoUrl}
          className="w-full h-full" 
          controls
          src={lesson.videoUrl}
        />
      </div>

      {/* Control Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-extrabold text-text-main leading-tight">
            {lesson.title}
          </h2>
          <span className="text-xs text-text-subtle mt-1 inline-block font-semibold">
            Duration: {lesson.duration}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isCompleted ? 'success' : 'outline'}
            size="sm"
            onClick={onToggleComplete}
            icon={isCompleted ? <Check className="h-4 w-4" /> : null}
          >
            {isCompleted ? 'Completed' : 'Complete Lesson'}
          </Button>

          {onPrev && (
            <Button variant="outline" size="sm" onClick={onPrev} icon={<ArrowLeft className="h-4 w-4" />}>
              Prev
            </Button>
          )}
          {onNext && (
            <Button variant="outline" size="sm" onClick={onNext}>
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border text-sm">
        {(['content', 'resources', 'notes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-bold capitalize transition-colors focus:outline-none ${
              activeTab === tab 
                ? 'border-b-2 border-secondary text-secondary' 
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[120px]">
        {activeTab === 'content' && (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-text-muted">
              {lesson.description}
            </p>
            {lesson.isPreview && (
              <Badge variant="primary">Preview Material</Badge>
            )}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-text-main uppercase tracking-wider">Lesson Attachments</h4>
            {lesson.resources.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lesson.resources.map((res, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3 border border-border rounded-card bg-surface-muted text-xs font-semibold"
                  >
                    <span className="flex items-center gap-2 text-text-muted truncate">
                      <FileText className="h-4 w-4 text-secondary flex-shrink-0" />
                      {res}
                    </span>
                    <button className="p-1.5 text-text-subtle hover:text-secondary focus:outline-none" aria-label="Download resource">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-subtle">No references attached to this lesson.</p>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            <form onSubmit={handleAddNote} className="flex gap-2">
              <Input
                placeholder="Take a quick note for this timestamp..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <Button type="submit" variant="secondary" icon={<Send className="h-4 w-4" />}>
                Add Note
              </Button>
            </form>
            {notesList.length > 0 ? (
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {notesList.map((note, idx) => (
                  <li 
                    key={idx} 
                    className="p-3 border border-border rounded-card bg-surface-muted text-xs text-text-muted flex items-start"
                  >
                    <span className="flex-grow leading-relaxed">{note}</span>
                    <Badge variant="neutral" className="ml-2 scale-75 select-none">Notes</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-text-subtle">No personal notes yet. Type a note above to record concepts.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 5. LESSON SIDEBAR
// ==========================================
interface LessonSidebarProps {
  modules: Module[];
  completedLessons: string[];
  activeLessonId: string;
  onSelectLesson: (lesson: Lesson) => void;
  onToggleComplete: (lessonId: string, checked: boolean) => void;
  quiz?: Quiz;
  quizCompleted?: boolean;
  onSelectQuiz?: () => void;
  activeQuizSelected?: boolean;
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({
  modules,
  completedLessons,
  activeLessonId,
  onSelectLesson,
  onToggleComplete,
  quiz,
  quizCompleted = false,
  onSelectQuiz,
  activeQuizSelected = false
}) => {
  const [expandedModules, setExpandedModules] = useState<{ [modId: string]: boolean }>({});

  useEffect(() => {
    const initialExpanded: { [key: string]: boolean } = {};
    modules.forEach((mod) => {
      if (mod.lessons.some((l) => l.id === activeLessonId)) {
        initialExpanded[mod.id] = true;
      }
    });
    setExpandedModules((prev) => ({ ...prev, ...initialExpanded }));
  }, [activeLessonId, modules]);

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  return (
    <div className="bg-surface border border-border rounded-card text-left flex flex-col h-full w-full">
      {/* Title */}
      <div className="px-5 py-4 border-b border-border bg-bg-elevated/50 rounded-t-card">
        <h3 className="text-xs font-extrabold text-text-main uppercase tracking-wider">
          Course Syllabus
        </h3>
      </div>

      {/* Syllabus outline */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-[500px] md:max-h-[600px]">
        {modules.map((mod) => {
          const isExpanded = expandedModules[mod.id] ?? true;
          return (
            <div key={mod.id} className="space-y-1.5">
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between text-xs font-extrabold text-text-main uppercase tracking-wider py-1 hover:text-secondary transition-colors"
              >
                <span className="truncate">{mod.title}</span>
                <span className="text-[10px] text-text-subtle font-bold">{isExpanded ? 'Hide' : 'Show'}</span>
              </button>
              
              {isExpanded && (
                <div className="pl-2 border-l border-border/80 space-y-1.5 pt-1">
                  {mod.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId && !activeQuizSelected;
                    const isDone = completedLessons.includes(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson)}
                        className={`flex items-start gap-2.5 p-2 rounded-ctrl text-xs cursor-pointer select-none transition-all border ${
                          isActive
                            ? 'bg-secondary border-secondary/20 text-[#111827] font-bold shadow-sm'
                            : 'bg-transparent border-transparent text-text-muted hover:text-text-main hover:bg-surface-muted'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={(e) => {
                            e.stopPropagation();
                            onToggleComplete(lesson.id, e.target.checked);
                          }}
                          className="mt-0.5 h-3.5 w-3.5 rounded border-border text-secondary focus:ring-0 cursor-pointer"
                        />
                        <div className="flex-grow truncate">
                          <p className="truncate font-semibold">{lesson.title}</p>
                          <span className="text-[10px] opacity-80 flex items-center gap-1 mt-0.5">
                            <Clock className="h-2.5 w-2.5" /> {lesson.duration}
                          </span>
                        </div>
                        {isDone && <CheckCircle2 className={`h-4 w-4 ${isActive ? 'text-[#111827]' : 'text-success'} flex-shrink-0`} />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Final Quiz node if exists */}
        {quiz && onSelectQuiz && (
          <div className="pt-3 border-t border-border">
            <button
              onClick={onSelectQuiz}
              className={`w-full flex items-center justify-between p-3 rounded-ctrl border transition-all ${
                activeQuizSelected
                  ? 'bg-secondary border-secondary text-[#111827] font-black'
                  : 'bg-surface-muted border-border text-text-muted hover:border-secondary'
              }`}
            >
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <Award className="h-4 w-4 text-warning" />
                {quiz.title}
              </span>
              {quizCompleted ? (
                <Badge variant="success" className="scale-90">Passed</Badge>
              ) : (
                <Badge variant="primary" className="scale-90">Quiz</Badge>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 6. QUIZ COMPONENT
// ==========================================
interface QuizComponentProps {
  quiz: Quiz;
  onSubmit: (score: number) => void;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ quiz, onSubmit }) => {
  const [currQ, setCurrQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIdx: number]: number }>({});
  const activeQuestion = quiz.questions[currQ];

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers({ ...selectedAnswers, [currQ]: optIdx });
  };

  const handleNext = () => {
    if (currQ < quiz.questions.length - 1) {
      setCurrQ(currQ + 1);
    }
  };

  const handlePrev = () => {
    if (currQ > 0) {
      setCurrQ(currQ - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    onSubmit(score);
  };

  const isAllAnswered = Object.keys(selectedAnswers).length === quiz.questions.length;

  return (
    <Card className="text-left bg-surface border border-border p-6 max-w-2xl mx-auto space-y-6">
      {/* Quiz Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-border">
        <h3 className="text-sm font-extrabold text-text-main uppercase tracking-wider flex items-center gap-2">
          <Award className="h-5 w-5 text-warning" /> {quiz.title}
        </h3>
        <Badge variant="secondary">
          Question {currQ + 1} of {quiz.questions.length}
        </Badge>
      </div>

      {/* Progress indicators */}
      <div className="flex gap-2 justify-center">
        {quiz.questions.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 rounded-full flex-grow max-w-[40px] transition-colors ${
              currQ === idx 
                ? 'bg-secondary' 
                : selectedAnswers[idx] !== undefined 
                ? 'bg-secondary/40' 
                : 'bg-surface-muted'
            }`}
          />
        ))}
      </div>

      {/* Question Text */}
      <div className="space-y-4">
        <h4 className="text-base font-extrabold text-text-main leading-snug">
          {activeQuestion.questionText}
        </h4>
        
        {/* Options */}
        <div className="space-y-2.5">
          {activeQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswers[currQ] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-ctrl text-sm font-semibold border transition-all text-left ${
                  isSelected
                    ? 'bg-secondary border-secondary text-[#111827]'
                    : 'bg-surface-muted border-border text-text-muted hover:border-secondary'
                }`}
              >
                <span>{option}</span>
                {isSelected && <Check className="h-4 w-4 text-[#111827]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currQ === 0}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Previous
        </Button>

        {currQ < quiz.questions.length - 1 ? (
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={selectedAnswers[currQ] === undefined}
          >
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isAllAnswered}
          >
            Submit Quiz
          </Button>
        )}
      </div>
    </Card>
  );
};

// ==========================================
// 7. CERTIFICATE CARD
// ==========================================
interface CertificateCardProps {
  certificate: Certificate;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
  const handlePrint = () => {
    trackCertificateGenerate(certificate.courseId);
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto border-4 border-double border-secondary bg-surface rounded-overlay p-6 sm:p-10 text-center relative overflow-hidden shadow-lg">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
        <Award className="h-96 w-96 text-secondary" />
      </div>

      <div className="border border-border p-6 sm:p-8 space-y-6">
        <div className="flex flex-col items-center gap-2">
          <Award className="h-12 w-12 text-warning" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-secondary">
            Certificate of Completion
          </span>
        </div>

        <div className="space-y-2">
          <span className="text-xs text-text-subtle italic block">This credential certifies that</span>
          <h2 className="text-xl sm:text-2xl font-black text-text-main tracking-tight border-b-2 border-primary max-w-sm mx-auto pb-1.5 uppercase">
            {certificate.recipientName}
          </h2>
        </div>

        <div className="space-y-1.5 max-w-lg mx-auto">
          <span className="text-xs text-text-subtle italic block">has successfully completed all requirements for</span>
          <h3 className="text-sm sm:text-base font-extrabold text-text-main leading-tight">
            {certificate.courseTitle}
          </h3>
          <span className="text-[11px] text-text-muted block font-semibold mt-1">
            instructed by {certificate.instructorName}
          </span>
        </div>

        {/* Footer verification codes and signatures */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] text-text-subtle font-bold uppercase tracking-wider">
          <div className="text-left space-y-1">
            <span className="block">Issue Date: {certificate.issueDate}</span>
            <span className="block text-secondary truncate">ID: {certificate.credentialId}</span>
          </div>

          <div className="text-right flex flex-col items-center sm:items-end">
            <div className="font-mono text-xs text-text-main italic font-semibold border-b border-primary pb-1">
              Evelyn Sterling
            </div>
            <span className="mt-1 block text-text-muted">Tutor Signature</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-3 print:hidden">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          Print / Save PDF
        </Button>
      </div>
    </div>
  );
};

// ==========================================
// 8. BENTO FEATURE CARD
// ==========================================
interface BentoFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  className?: string;
}

export const BentoFeatureCard: React.FC<BentoFeatureCardProps> = ({ 
  title, 
  description, 
  icon, 
  badge,
  className = '' 
}) => {
  return (
    <div className={`bg-surface border border-border rounded-card p-6 flex flex-col justify-between text-left hover:-translate-y-1.5 hover:border-secondary transition-all duration-300 shadow-[0_4px_12px_-2px_rgba(17,24,39,0.04)] hover:shadow-[0_16px_32px_-12px_rgba(17,24,39,0.12)] overflow-hidden relative ${className}`}>
      <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-secondary/5 blur-xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-secondary/10 text-secondary rounded-card">
            {icon}
          </div>
          {badge && <Badge variant="primary">{badge}</Badge>}
        </div>
        <h3 className="text-xs font-extrabold text-text-main tracking-wider mb-2 uppercase">
          {title}
        </h3>
        <p className="text-xs text-text-muted leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 9. COURSE BUILDER
// ==========================================
interface CourseBuilderProps {
  initialCourse: Course;
  onSave: (course: Course) => void;
}

export const CourseBuilder: React.FC<CourseBuilderProps> = ({ initialCourse, onSave }) => {
  const [course, setCourse] = useState<Course>(initialCourse);
  const [activeTab, setActiveTab] = useState<'info' | 'syllabus'>('info');

  const handleUpdateField = (field: keyof Course, value: any) => {
    setCourse({ ...course, [field]: value });
  };

  const handleAddModule = () => {
    const newModule: Module = {
      id: `mod-${Math.random().toString(36).substr(2, 9)}`,
      title: `Module ${course.modules.length + 1}: Syllabus Section`,
      lessons: []
    };
    handleUpdateField('modules', [...course.modules, newModule]);
  };

  const handleDeleteModule = (modId: string) => {
    handleUpdateField('modules', course.modules.filter(m => m.id !== modId));
  };

  const handleAddLesson = (modId: string) => {
    const updatedModules = course.modules.map(mod => {
      if (mod.id !== modId) return mod;
      const newLesson: Lesson = {
        id: `les-${Math.random().toString(36).substr(2, 9)}`,
        title: `New Lesson`,
        duration: '10:00',
        description: 'Lesson overview summary.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        resources: []
      };
      return {
        ...mod,
        lessons: [...mod.lessons, newLesson]
      };
    });
    handleUpdateField('modules', updatedModules);
  };

  const handleUpdateLesson = (modId: string, lessonId: string, updatedFields: Partial<Lesson>) => {
    const updatedModules = course.modules.map(mod => {
      if (mod.id !== modId) return mod;
      return {
        ...mod,
        lessons: mod.lessons.map(les => les.id === lessonId ? { ...les, ...updatedFields } : les)
      };
    });
    handleUpdateField('modules', updatedModules);
  };

  const handleDeleteLesson = (modId: string, lessonId: string) => {
    const updatedModules = course.modules.map(mod => {
      if (mod.id !== modId) return mod;
      return {
        ...mod,
        lessons: mod.lessons.filter(l => l.id !== lessonId)
      };
    });
    handleUpdateField('modules', updatedModules);
  };

  return (
    <div className="space-y-6 text-left w-full">
      <div className="flex border-b border-border">
        <button 
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 font-bold text-sm focus:outline-none ${activeTab === 'info' ? 'border-b-2 border-secondary text-secondary' : 'text-text-muted'}`}
        >
          Basic Information
        </button>
        <button 
          onClick={() => setActiveTab('syllabus')}
          className={`px-4 py-2 font-bold text-sm focus:outline-none ${activeTab === 'syllabus' ? 'border-b-2 border-secondary text-secondary' : 'text-text-muted'}`}
        >
          Syllabus Visual Editor
        </button>
      </div>

      {activeTab === 'info' && (
        <Card className="p-6 space-y-4 bg-surface border border-border">
          <Input 
            label="Course Title" 
            value={course.title} 
            onChange={(e) => handleUpdateField('title', e.target.value)} 
          />
          
          <Textarea 
            label="Course Description" 
            value={course.description} 
            onChange={(e) => handleUpdateField('description', e.target.value)} 
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select 
              label="Category"
              value={course.category}
              options={[
                { value: 'Web Development', label: 'Web Development' },
                { value: 'Data Science', label: 'Data Science' },
                { value: 'UI/UX Design', label: 'UI/UX Design' },
                { value: 'Mobile Dev', label: 'Mobile Dev' },
                { value: 'Business & Marketing', label: 'Business & Marketing' },
              ]}
              onChange={(e) => handleUpdateField('category', e.target.value)}
            />
            <Select 
              label="Difficulty Level"
              value={course.difficulty}
              options={[
                { value: 'Beginner', label: 'Beginner' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Advanced', label: 'Advanced' },
              ]}
              onChange={(e) => handleUpdateField('difficulty', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select 
              label="Pricing Model"
              value={course.isFree ? 'free' : 'paid'}
              options={[
                { value: 'free', label: 'Free Course' },
                { value: 'paid', label: 'Paid Premium' },
              ]}
              onChange={(e) => {
                const isFree = e.target.value === 'free';
                handleUpdateField('isFree', isFree);
                if (isFree) handleUpdateField('price', 0);
              }}
            />
            
            {!course.isFree && (
              <Input 
                label="Price ($)" 
                type="number"
                value={course.price || 0} 
                onChange={(e) => handleUpdateField('price', parseFloat(e.target.value))} 
              />
            )}

            <Input 
              label="Estimated Duration" 
              value={course.duration} 
              placeholder="e.g. 10h 30m"
              onChange={(e) => handleUpdateField('duration', e.target.value)} 
            />
          </div>

          <Input 
            label="Thumbnail URL" 
            value={course.thumbnail} 
            onChange={(e) => handleUpdateField('thumbnail', e.target.value)} 
          />

          <div className="pt-4 flex justify-end">
            <Button onClick={() => onSave(course)}>Save Draft Details</Button>
          </div>
        </Card>
      )}

      {activeTab === 'syllabus' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-main">Syllabus Outline</h3>
            <Button variant="outline" size="sm" onClick={handleAddModule} icon={<Plus className="h-4 w-4" />}>
              Add Module
            </Button>
          </div>

          {course.modules.length > 0 ? (
            course.modules.map((mod, mIdx) => (
              <Card key={mod.id} className="p-5 border border-border bg-surface space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <Input 
                    value={mod.title}
                    onChange={(e) => {
                      const updatedModules = [...course.modules];
                      updatedModules[mIdx].title = e.target.value;
                      handleUpdateField('modules', updatedModules);
                    }}
                    className="font-bold border-transparent bg-transparent hover:border-border focus:bg-surface-muted"
                  />
                  <button 
                    onClick={() => handleDeleteModule(mod.id)}
                    className="p-2 text-text-subtle hover:text-danger rounded-ctrl focus:outline-none"
                    aria-label="Delete Module"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Lessons list */}
                <div className="pl-4 border-l border-border space-y-3.5 pt-2">
                  {mod.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex flex-col sm:flex-row gap-3 items-start p-3 border border-border rounded-ctrl bg-surface-muted w-full relative">
                      <div className="flex-1 space-y-2.5 w-full">
                        <Input 
                          value={lesson.title} 
                          onChange={(e) => handleUpdateLesson(mod.id, lesson.id, { title: e.target.value })}
                          placeholder="Lesson Title"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input 
                            value={lesson.duration} 
                            onChange={(e) => handleUpdateLesson(mod.id, lesson.id, { duration: e.target.value })}
                            placeholder="Duration e.g. 10:00"
                          />
                          <Input 
                            value={lesson.videoUrl} 
                            onChange={(e) => handleUpdateLesson(mod.id, lesson.id, { videoUrl: e.target.value })}
                            placeholder="Video URL"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteLesson(mod.id, lesson.id)}
                        className="p-1.5 text-text-subtle hover:text-danger rounded-ctrl self-end sm:self-center"
                        aria-label="Delete Lesson"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="pt-2">
                    <Button variant="ghost" size="sm" onClick={() => handleAddLesson(mod.id)} icon={<Plus className="h-4.5 w-4.5" />}>
                      Add Lesson
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center p-8 bg-surface border border-border rounded-card text-xs text-text-subtle">
              No syllabus modules created yet. Add a module to start drafting lessons.
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <Button onClick={() => onSave(course)}>Save Syllabus Details</Button>
          </div>
        </div>
      )}
    </div>
  );
};
