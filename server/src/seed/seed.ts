import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db';
import { User } from '../models/User.model';
import { Course } from '../models/Course.model';
import { Category } from '../models/Category.model';
import { Enrollment } from '../models/Enrollment.model';
import { Progress } from '../models/Progress.model';
import { Certificate } from '../models/Certificate.model';

const seedData = async () => {
  try {
    // 1. Connect to DB
    await connectDB();

    console.log('🧹 Clearing existing database collections...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Category.deleteMany({});
    await Enrollment.deleteMany({});
    await Progress.deleteMany({});
    await Certificate.deleteMany({});

    console.log('👤 Seeding Users...');
    
    // Seed Student
    const student = await User.create({
      name: 'Sarah Connor',
      email: 'student@thelearningcollective.com',
      passwordHash: 'student123', // Will be hashed by pre-save hook
      role: 'student',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      bio: 'Avid learner looking to pivot my career into AI building and MVP engineering.',
      joinedDate: new Date('2026-01-10'),
    });

    // Seed Instructor
    const instructor = await User.create({
      name: 'Dr. Evelyn Sterling',
      email: 'instructor@thelearningcollective.com',
      passwordHash: 'instructor123', // Will be hashed by pre-save hook
      role: 'instructor',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      title: 'Principal Software Architect & Educator',
      bio: 'Over 15 years of industry experience building scalable distributed systems and training thousands of engineers worldwide.',
      joinedDate: new Date('2024-08-15'),
    });

    // Seed Admin
    const admin = await User.create({
      name: 'Marcus Vance',
      email: 'admin@thelearningcollective.com',
      passwordHash: 'admin123', // Will be hashed by pre-save hook
      role: 'admin',
      avatarUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150',
      bio: 'Lead Platform Administrator for Veloria Academy.',
      joinedDate: new Date('2023-03-01'),
    });

    console.log('📁 Seeding Categories...');
    await Category.create([
      { name: 'AI', icon: 'Zap', count: 1 },
      { name: 'Engineering', icon: 'Code', count: 2 },
      { name: 'Business', icon: 'TrendingUp', count: 1 },
      { name: 'Productivity', icon: 'Clock', count: 1 },
    ]);

    console.log('📚 Seeding Courses...');
    const course1 = await Course.create({
      title: 'Become An AI Builder In 30 Days',
      slug: 'become-an-ai-builder-in-30-days',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800',
      description: 'A comprehensive, mentor-led program designed to turn you into a highly capable AI builder. Master prompt engineering, automate complex workflows, connect APIs, and ship 7+ real-world AI mini-products.',
      shortDescription: 'Build, automate, and ship real-world AI products in 30 days.',
      fullDescription: 'AI is shifting from a novelty to a fundamental layer of modern product design. In this course, you will not just learn theory; you will build. Over 30 days, we walk you through prompt engineering, low-code automation tools, API integrations, and building fully functional AI micro-applications. By the end, you will have a solid portfolio of active AI tools and workflows to show employers or clients.',
      category: 'AI',
      difficulty: 'Intermediate',
      duration: '30 Days',
      isFree: false,
      price: 49.00,
      originalPrice: 99.00,
      instructorName: instructor.name,
      instructorId: instructor._id,
      rating: 4.8,
      enrolledCount: 1,
      certificateAvailable: true,
      status: 'published',
      modelEmbedUrl: 'https://sketchfab.com/models/788c03cc50d84a779144d2d46e3be473/embed',
      tags: ['AI', 'Prompt Engineering', 'Low-Code', 'Automation', 'APIs'],
      requirements: [
        'No prior programming experience required; basics of web browsing are sufficient.',
        'A computer with reliable internet access.',
        'Active free-tier accounts on OpenAI and Make/Zapier (guided setup included).'
      ],
      outcomes: [
        'Create advanced, repeatable prompt templates for LLMs.',
        'Automate daily research, content, and productivity tasks using AI agents.',
        'Build no-code AI chat bots and content generators connected to web interfaces.',
        'Connect external APIs (OpenAI, Anthropic) to custom web pages.',
        'Ship a complete portfolio of 7 active AI mini-projects.'
      ],
      modules: [
        {
          id: 'ai-m1',
          title: 'Module 1: AI Foundations',
          lessons: [
            {
              id: 'ai-m1-l1',
              title: 'What AI Can and Cannot Do',
              duration: '10:15',
              description: 'Understand the current state of large language models, their limitations, token costs, and how to spot hallucinated outputs.',
              videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              resources: ['ai-boundaries-cheat-sheet.pdf'],
              isPreview: true
            },
            {
              id: 'ai-m1-l2',
              title: 'Modern AI Tools Overview',
              duration: '14:20',
              description: 'A survey of the landscape: OpenAI APIs, Anthropic Claude, Midjourney, and open-source models (Llama).',
              videoUrl: 'https://www.w3schools.com/html/movie.mp4',
              resources: ['ai-tool-directory.pdf']
            },
            {
              id: 'ai-m1-l3',
              title: 'Prompt Engineering Basics',
              duration: '18:45',
              description: 'Learn system prompting, few-shot prompting, and chain-of-thought methods to drastically improve LLM outputs.',
              videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              resources: ['prompt-templates.md']
            }
          ]
        },
        {
          id: 'ai-m2',
          title: 'Module 2: AI Workflow Building',
          lessons: [
            {
              id: 'ai-m2-l1',
              title: 'Automating Daily Tasks',
              duration: '15:30',
              description: 'How to use AI for sorting emails, summarizing transcripts, and streamlining daily updates.',
              videoUrl: 'https://www.w3schools.com/html/movie.mp4',
              resources: ['task-automation-recipes.pdf']
            }
          ]
        }
      ],
      quiz: {
        id: 'quiz-ai-final',
        title: 'Become An AI Builder Competency Quiz',
        questions: [
          {
            id: 'q1',
            questionText: 'Which prompting technique involves feeding example outputs to the LLM?',
            options: ['Zero-shot Prompting', 'Few-shot Prompting', 'Chain-of-thought Prompting', 'System Instructions'],
            correctAnswerIndex: 1,
          },
          {
            id: 'q2',
            questionText: 'What is a common LLM failure mode where it outputs plausible-sounding but false information?',
            options: ['Refusal', 'Fine-tuning error', 'Hallucination', 'Token starvation'],
            correctAnswerIndex: 2,
          }
        ],
        passingScore: 50,
      }
    });

    const course2 = await Course.create({
      title: 'Solopreneur - Solo Agency Masterclass',
      slug: 'solopreneur-solo-agency-masterclass',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
      description: 'Learn how to build, scale, and automate a high-ticket solo web agency. Zero employees, high margins, and complete scheduling freedom.',
      shortDescription: 'Build and run a high-margin one-person agency.',
      category: 'Business',
      difficulty: 'Beginner',
      duration: '12 Hours',
      isFree: false,
      price: 29.00,
      instructorName: instructor.name,
      instructorId: instructor._id,
      rating: 4.9,
      enrolledCount: 0,
      certificateAvailable: true,
      status: 'published',
      modules: [
        {
          id: 'solo-m1',
          title: 'Module 1: Positioning Your Services',
          lessons: [
            {
              id: 'solo-m1-l1',
              title: 'The Solo Agency Advantage',
              duration: '12:00',
              description: 'Why small agency models outperform complex corporate scales on developer margins.',
              videoUrl: 'https://www.w3schools.com/html/movie.mp4',
              resources: ['agency-manifesto.pdf'],
              isPreview: true
            }
          ]
        }
      ]
    });

    console.log('🔑 Seeding default student enrollment...');
    await Enrollment.create({
      userId: student._id,
      courseId: course1._id,
      progress: 50, // 50%
      completedLessons: ['ai-m1-l1', 'ai-m1-l2'],
      completedQuizzes: new Map([['quiz-ai-final', 0]]),
    });

    console.log('✅ Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
