import { Course } from '../types';

export const edrillaCourses: Course[] = [
  {
    id: 'course-ai-builder',
    title: 'Become An AI Builder In 30 Days',
    slug: 'become-an-ai-builder-in-30-days',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800',
    description: 'A comprehensive, mentor-led program designed to turn you into a highly capable AI builder. Master prompt engineering, automate complex workflows, connect APIs, and ship 7+ real-world AI mini-products.',
    shortDescription: 'Build, automate, and ship real-world AI products in 30 days.',
    fullDescription: 'AI is shifting from a novelty to a fundamental layer of modern product design. In this course, you will not just learn theory; you will build. Over 30 days, we walk you through prompt engineering, low-code automation tools, API integrations, and building fully functional AI micro-applications. By the end, you will have a solid portfolio of active AI tools and workflows to show employers or clients.',
    category: 'AI',
    difficulty: 'Intermediate',
    level: 'Intermediate',
    duration: '30 Days',
    isFree: false,
    price: 49.00,
    originalPrice: 99.00,
    language: 'English',
    instructorName: 'Dr. Evelyn Sterling',
    instructorId: 'user-instructor',
    instructor: 'Dr. Evelyn Sterling',
    rating: 4.8,
    enrolledCount: 1540,
    enrolledStudents: 1540,
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
    createdAt: '2026-05-01T08:00:00Z',
    updatedAt: '2026-06-10T12:00:00Z',
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
          },
          {
            id: 'ai-m2-l2',
            title: 'AI for Content, Research, and Productivity',
            duration: '20:10',
            description: 'Build prompt frameworks that research topics, organize outline summaries, and draft blog structures.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: ['content-research-framework.zip']
          },
          {
            id: 'ai-m2-l3',
            title: 'Building Repeatable AI Workflows',
            duration: '22:15',
            description: 'Connect webhooks and email triggers to run automated AI analysis jobs in the background.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['repeatable-workflows-diagram.png']
          }
        ]
      },
      {
        id: 'ai-m3',
        title: 'Module 3: AI App Building',
        lessons: [
          {
            id: 'ai-m3-l1',
            title: 'No-Code and Low-Code AI Tools',
            duration: '16:40',
            description: 'Introduction to platforms like Make.com, Flowise, and Retool to assemble visual AI pipelines.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: ['lowcode-getting-started.pdf'],
            isPreview: true
          },
          {
            id: 'ai-m3-l2',
            title: 'Connecting APIs',
            duration: '19:50',
            description: 'Make curl requests, manage secure keys, parse json payloads, and hook OpenAI to simple HTML frontends.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['api-payload-samples.json']
          },
          {
            id: 'ai-m3-l3',
            title: 'Building Useful AI Mini-Products',
            duration: '25:30',
            description: 'Assembling a complete mini-product: a custom translation or text analyzer that runs on the web.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: ['miniproduct-blueprint.zip']
          }
        ]
      },
      {
        id: 'ai-m4',
        title: 'Module 4: Real-World AI Projects',
        lessons: [
          {
            id: 'ai-m4-l1',
            title: 'Project Planning',
            duration: '12:15',
            description: 'Define your user scope, structure data requirements, and outline the user flow for your portfolio app.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['project-scope-template.docx']
          },
          {
            id: 'ai-m4-l2',
            title: 'Building Portfolio-Ready AI Projects',
            duration: '28:40',
            description: 'Develop your core AI features, implement simple frontend UI cards, and hook up logic triggers.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: ['portfolio-starter-template.zip']
          },
          {
            id: 'ai-m4-l3',
            title: 'Presenting Your Work',
            duration: '15:10',
            description: 'How to record product demo recordings, write clear readmes, and deploy your live app on Vercel.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['presentation-checklist.pdf']
          }
        ]
      },
      {
        id: 'ai-m5',
        title: 'Module 5: Career and Freelance Readiness',
        lessons: [
          {
            id: 'ai-m5-l1',
            title: 'AI Builder Portfolio Essentials',
            duration: '14:30',
            description: 'Organize your GitHub readme and personal site to showcase shipped AI tools and integrations.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: ['portfolio-layout-spec.pdf']
          },
          {
            id: 'ai-m5-l2',
            title: 'Client Problem Solving with AI',
            duration: '17:15',
            description: 'How to pitch automation to local businesses, write project proposals, and structure pricing.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['proposal-template.md']
          }
        ]
      }
    ],
    quiz: {
      id: 'quiz-ai-builder',
      title: 'AI Builder Competency Assessment',
      passingScore: 70,
      questions: [
        {
          id: 'q-ai-1',
          questionText: 'Which prompting technique involves showing the LLM a few examples of input-output pairs before asking for the final answer?',
          options: [
            'Zero-shot prompting',
            'Few-shot prompting',
            'System prompting',
            'Instruction tuning'
          ],
          correctAnswerIndex: 1
        },
        {
          id: 'q-ai-2',
          questionText: 'What is the primary function of webhooks in low-code automation tools like Make or Zapier?',
          options: [
            'To store massive vector datasets',
            'To instantly trigger a workflow in response to external events',
            'To compile python code in the browser',
            'To translate user prompts into spanish'
          ],
          correctAnswerIndex: 2
        },
        {
          id: 'q-ai-3',
          questionText: 'To safely call external APIs from a frontend web app without exposing secret API keys, you should:',
          options: [
            'Hardcode the keys in a public script tag',
            'Route requests through a simple backend/server proxy that injects the key',
            'Ask the user to input their own API key on every click',
            'Encrypt the key using client-side JavaScript'
          ],
          correctAnswerIndex: 1
        }
      ]
    }
  },
  {
    id: 'course-mvp-engineering',
    title: 'MVP Engineering',
    slug: 'mvp-engineering',
    thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800',
    description: 'Learn how to build, test, and ship modern Minimum Viable Products (MVPs) quickly. Build UI components, integrate databases, deploy to cloud hosts, and ship without developer blockages.',
    shortDescription: 'Build, ship, and scale your product MVPs without developer delays.',
    fullDescription: 'The biggest risk for any product founder is building something nobody wants. In this course, you will learn the engineering discipline behind MVPs: choosing core features, structuring databases, building responsive frontends, and launching production-ready MVPs. Stop waiting for agencies; build your own product.',
    category: 'Engineering',
    difficulty: 'Advanced',
    level: 'Advanced',
    duration: '15h 45m',
    isFree: false,
    price: 39.00,
    originalPrice: 79.00,
    language: 'English',
    instructorName: 'Dr. Evelyn Sterling',
    instructorId: 'user-instructor',
    instructor: 'Dr. Evelyn Sterling',
    rating: 4.9,
    enrolledCount: 980,
    enrolledStudents: 980,
    certificateAvailable: true,
    status: 'published',
    tags: ['Engineering', 'MVP', 'Database', 'Deployment', 'Product Dev'],
    requirements: [
      'Basic familiarity with HTML, CSS, and general web interfaces.',
      'A code editor installed (VS Code recommended).',
      'Git and GitHub account active.'
    ],
    outcomes: [
      'Define core MVP user stories and scope features strictly.',
      'Construct high-fidelity, responsive layouts using modern utility variables.',
      'Initialize databases, configure user authentication, and wire APIs.',
      'Deploy full-stack codebases using Vercel, Netlify, or Fly.io.',
      'Collect product telemetry and user feedback loops instantly.'
    ],
    createdAt: '2026-05-15T08:00:00Z',
    updatedAt: '2026-06-11T10:00:00Z',
    modules: [
      {
        id: 'mvp-m1',
        title: 'Module 1: Product Thinking',
        lessons: [
          {
            id: 'mvp-m1-l1',
            title: 'Understanding MVPs and Product Limits',
            duration: '09:20',
            description: 'Learn how to differentiate a prototype from an MVP, find core user values, and avoid feature bloat.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['mvp-scoping-template.pdf'],
            isPreview: true
          },
          {
            id: 'mvp-m1-l2',
            title: 'Identifying User Problems & Storyboards',
            duration: '12:15',
            description: 'Draft user flows, storyboard onboarding steps, and structure the primary database tables.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: ['storyboard-cheatsheet.pdf']
          },
          {
            id: 'mvp-m1-l3',
            title: 'Choosing Core Features strictly',
            duration: '11:40',
            description: 'Use the Moscow method and user-feedback loops to strip down your backlog to essentials.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['backlog-prioritization-sheet.csv']
          }
        ]
      },
      {
        id: 'mvp-m2',
        title: 'Module 2: Frontend Foundations',
        lessons: [
          {
            id: 'mvp-m2-l1',
            title: 'UI Structure & Semantic layout tags',
            duration: '14:30',
            description: 'Write accessible HTML markup using headers, main content regions, and clean semantic lists.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: ['html-semantics-checklist.pdf']
          },
          {
            id: 'mvp-m2-l2',
            title: 'Responsive layouts with CSS Grid and Flexbox',
            duration: '18:15',
            description: 'Learn spacing scaling, media query break points, and aligning flex items for mobile viewports.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['flexbox-vs-grid.pdf']
          },
          {
            id: 'mvp-m2-l3',
            title: 'Bento Design Systems implementation',
            duration: '16:45',
            description: 'Apply uniform borders, card structures, clean grid alignment, and typography tokens.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: ['bento-grid-blueprint.css'],
            isPreview: true
          }
        ]
      },
      {
        id: 'mvp-m3',
        title: 'Module 3: Backend Basics',
        lessons: [
          {
            id: 'mvp-m3-l1',
            title: 'REST APIs & Payload structures',
            duration: '15:20',
            description: 'Understand GET, POST, PUT, and DELETE methods, status codes, and JSON exchange formats.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['api-payload-guide.pdf']
          },
          {
            id: 'mvp-m3-l2',
            title: 'Simulated and Real JWT Authentication',
            duration: '22:10',
            description: 'Configure login hooks, store session parameters safely in cookies, and block public routes.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: ['auth-helpers-starter.ts']
          },
          {
            id: 'mvp-m3-l3',
            title: 'Database Schema Structures',
            duration: '19:40',
            description: 'Define relational models: Users, Projects, and Subscriptions. Connect tables via references.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['relational-schema-map.sql']
          }
        ]
      },
      {
        id: 'mvp-m4',
        title: 'Module 4: Shipping Fast',
        lessons: [
          {
            id: 'mvp-m4-l1',
            title: 'Vite and Vercel Deployments',
            duration: '11:15',
            description: 'Configure git repositories, launch vercel builds, and map custom domain names.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: ['deployment-checklist.pdf']
          },
          {
            id: 'mvp-m4-l2',
            title: 'Testing and User Error Fallbacks',
            duration: '13:50',
            description: 'Implement frontend safety states, validation bounds, and handle network disconnect notifications.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['error-boundary-sample.tsx']
          }
        ]
      },
      {
        id: 'mvp-m5',
        title: 'Module 5: Final MVP Build',
        lessons: [
          {
            id: 'mvp-m5-l1',
            title: 'Completing the MVP Build project',
            duration: '35:20',
            description: 'Step-by-step assembly of a complete portfolio MVP, integrating forms, databases, and notifications.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: ['final-mvp-assets.zip']
          },
          {
            id: 'mvp-m5-l2',
            title: 'Polish and Launch Checklist',
            duration: '15:10',
            description: 'Review contrast states, test keyboard traversal, clean console logs, and hit publish.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['launch-day-checklist.pdf']
          }
        ]
      }
    ],
    quiz: {
      id: 'quiz-mvp',
      title: 'MVP Engineering Assessment',
      passingScore: 70,
      questions: [
        {
          id: 'q-mvp-1',
          questionText: 'What is the primary risk addressed by launching a Minimum Viable Product?',
          options: [
            'Venture capital regulation problems',
            'Building a product that nobody wants or needs',
            'Slow database query rehydration',
            'Missing CSS styles on mobile screens'
          ],
          correctAnswerIndex: 1
        },
        {
          id: 'q-mvp-2',
          questionText: 'To build a responsive card layouts that adapt columns dynamically without manual calculations, you should use:',
          options: [
            'Inline layout widths in pixels',
            'CSS Flexbox wraps or CSS Grid repeat auto-fit/fill columns',
            'Absolute coordinates on all cards',
            'Tables inside tables'
          ],
          correctAnswerIndex: 1
        }
      ]
    }
  },
  {
    id: 'course-content-creation',
    title: 'The Art Of Content Creation',
    slug: 'the-art-of-content-creation',
    thumbnail: 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800',
    description: 'Master the frameworks of copywriting, visual storytelling, and distribution metrics. Build a content publishing engine that gains traction organically.',
    shortDescription: 'Build an organic content publishing engine that drives traction.',
    fullDescription: 'Content is the leverage point for modern business. In this course, you will learn the creative workflows, scripts, and editing rhythms to publish compelling written and visual media that builds a community.',
    category: 'Business',
    difficulty: 'Beginner',
    level: 'Beginner',
    duration: '8h 20m',
    isFree: false,
    price: 19.00,
    originalPrice: 39.00,
    language: 'English',
    instructorName: 'Dr. Evelyn Sterling',
    instructorId: 'user-instructor',
    instructor: 'Dr. Evelyn Sterling',
    rating: 4.6,
    enrolledCount: 2100,
    enrolledStudents: 2100,
    certificateAvailable: true,
    status: 'published',
    tags: ['Content', 'Marketing', 'Copywriting', 'SEO'],
    requirements: [
      'Active accounts on standard social channels (Twitter/LinkedIn/YouTube).',
      'No specialized hardware needed; phone camera or computer works.'
    ],
    outcomes: [
      'Write highly engaging hooks and summaries for newsletters.',
      'Organize monthly media outlines in a Bento content planner.',
      'Capture clean visual assets and compile editing cuts.',
      'Understand search algorithms, tags, and distribution triggers.'
    ],
    createdAt: '2026-05-10T08:00:00Z',
    updatedAt: '2026-06-08T09:00:00Z',
    modules: [
      {
        id: 'cc-m1',
        title: 'Module 1: Content Planning Flow',
        lessons: [
          {
            id: 'cc-m1-l1',
            title: 'Creating Your Bento Content Planner',
            duration: '08:45',
            description: 'Organize text ideas, thumbnails, and dates in a visible bento layout grid.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['content-planner-template.xlsx'],
            isPreview: true
          }
        ]
      }
    ]
  },
  {
    id: 'course-website-easy',
    title: 'Website Made Easy',
    slug: 'website-made-easy',
    thumbnail: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800',
    description: 'Learn to design, customize, and publish beautiful landing pages without complex coding. Configure domains, map DNS records, and launch in hours.',
    shortDescription: 'Build and launch custom landing pages easily without coding delays.',
    fullDescription: 'Stop overcomplicating simple sites. In this beginner course, you will learn to build functional, clean landing pages, connect custom domain names, configure analytics, and publish live sites in hours.',
    category: 'Productivity',
    difficulty: 'Beginner',
    level: 'Beginner',
    duration: '4h 15m',
    isFree: true,
    price: 0.00,
    originalPrice: 0.00,
    language: 'English',
    instructorName: 'Dr. Evelyn Sterling',
    instructorId: 'user-instructor',
    instructor: 'Dr. Evelyn Sterling',
    rating: 4.7,
    enrolledCount: 3200,
    enrolledStudents: 3200,
    certificateAvailable: true,
    status: 'published',
    tags: ['Web Design', 'Landing Pages', 'Domain Setup', 'Beginner'],
    requirements: [
      'A modern browser (Chrome, Firefox, Safari).',
      'No web design or coding skills required.'
    ],
    outcomes: [
      'Design clean landing pages based on structural spacing grids.',
      'Configure custom domains, nameservers, and secure DNS records.',
      'Deploy lightning fast static files to hosting servers.',
      'Configure site analytics and contact capture boxes.'
    ],
    createdAt: '2026-04-20T08:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z',
    modules: [
      {
        id: 'we-m1',
        title: 'Module 1: Web Design Basics',
        lessons: [
          {
            id: 'we-m1-l1',
            title: 'Visual Spacing Rules and Typography Scales',
            duration: '06:30',
            description: 'Learn about text weights, container borders, and color contrasts.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: ['spacing-fundamentals.pdf'],
            isPreview: true
          }
        ]
      }
    ]
  },
  {
    id: 'course-solopreneur',
    title: 'Solopreneur - Solo Agency Masterclass',
    slug: 'solopreneur',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    description: 'Learn the Solo Agency Framework to package technical skills, build automated client systems, structure high-tier retainer proposals, and scale without employees.',
    shortDescription: 'Build, automate, and scale your solo agency business model.',
    fullDescription: 'Service businesses are the fastest path to financial independence. In this masterclass, you will learn the exact workflows, retainer contracts, client pipelines, and API automations to build a solo agency business.',
    category: 'Business',
    difficulty: 'Advanced',
    level: 'Advanced',
    duration: '10h 00m',
    isFree: false,
    price: 49.00,
    originalPrice: 149.00,
    language: 'English',
    instructorName: 'Dr. Evelyn Sterling',
    instructorId: 'user-instructor',
    instructor: 'Dr. Evelyn Sterling',
    rating: 4.9,
    enrolledCount: 840,
    enrolledStudents: 840,
    certificateAvailable: true,
    status: 'published',
    tags: ['Business', 'Agency', 'Solopreneur', 'Retainers', 'Automation'],
    requirements: [
      'A technical or marketing skill set ready to offer as a service.',
      'Willingness to conduct client outreach and write proposals.'
    ],
    outcomes: [
      'Structure high-value, productized services with clear scoping bounds.',
      'Build automated client onboarding sequences and project channels.',
      'Draft legally binding service level agreements and retainer contracts.',
      'Scale pricing structures to support premium recurring retainers.'
    ],
    createdAt: '2026-05-20T08:00:00Z',
    updatedAt: '2026-06-09T14:00:00Z',
    modules: [
      {
        id: 'sp-m1',
        title: 'Module 1: The Productized Service',
        lessons: [
          {
            id: 'sp-m1-l1',
            title: 'Packaging Skills into Bento Products',
            duration: '12:40',
            description: 'Define exact limits on what you deliver so you can productize client results.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['package-outline-sample.docx'],
            isPreview: true
          }
        ]
      }
    ]
  },
  {
    id: 'course-vibe-marketing',
    title: 'Vibe Marketing',
    slug: 'vibe-marketing',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    description: 'Learn the psychology of modern social attention, community building, meme-driven marketing channels, and creating viral hooks that match SaaS brands.',
    shortDescription: 'Master modern meme-driven marketing and organic community loops.',
    fullDescription: 'Old marketing playbooks are dying. In this course, you will learn to build a community-first brand that utilizes internet culture, memes, and viral loops to drive organic traffic to software tools and SaaS products.',
    category: 'Business',
    difficulty: 'Intermediate',
    level: 'Intermediate',
    duration: '6h 30m',
    isFree: false,
    price: 29.00,
    originalPrice: 59.00,
    language: 'English',
    instructorName: 'Dr. Evelyn Sterling',
    instructorId: 'user-instructor',
    instructor: 'Dr. Evelyn Sterling',
    rating: 4.5,
    enrolledCount: 1200,
    enrolledStudents: 1200,
    certificateAvailable: true,
    status: 'published',
    tags: ['Marketing', 'Branding', 'Memes', 'Community', 'SaaS Growth'],
    requirements: [
      'Familiarity with standard online platforms and internet culture.',
      'No marketing background required; raw enthusiasm is key.'
    ],
    outcomes: [
      'Analyze internet culture waves and design brand-appropriate memes.',
      'Deploy active community forums with clear onboarding guidelines.',
      'Produce short-form video hooks that drive high traffic.',
      'Launch organic viral referral campaigns.'
    ],
    createdAt: '2026-05-22T08:00:00Z',
    updatedAt: '2026-06-10T16:00:00Z',
    modules: [
      {
        id: 'vm-m1',
        title: 'Module 1: Internet Culture',
        lessons: [
          {
            id: 'vm-m1-l1',
            title: 'Decoding Memes and Modern SaaS Hooks',
            duration: '07:15',
            description: 'Learn how to construct short-form visual hooks that grab user attention.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: ['meme-marketing-basics.pdf'],
            isPreview: true
          }
        ]
      }
    ]
  },
  {
    id: 'course-draft-demo',
    title: 'SaaS Analytics and Growth',
    slug: 'saas-analytics-and-growth-draft',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    description: 'A comprehensive draft module outlining key pricing, cohort retention, and SQL instrumentation funnels for SaaS products.',
    shortDescription: 'Product metrics, instrumentation, and cohort growth analytics.',
    fullDescription: 'Master modern SaaS mechanics. This course is currently in draft mode and undergoing syllabus reviews before release.',
    category: 'Business',
    difficulty: 'Advanced',
    level: 'Advanced',
    duration: '10h 30m',
    isFree: false,
    price: 79.00,
    originalPrice: 149.00,
    language: 'English',
    instructorName: 'Dr. Evelyn Sterling',
    instructorId: 'user-instructor',
    instructor: 'Dr. Evelyn Sterling',
    rating: 0,
    enrolledCount: 0,
    enrolledStudents: 0,
    certificateAvailable: true,
    status: 'draft',
    tags: ['Business', 'SaaS', 'Analytics', 'Growth'],
    requirements: ['Understanding of SaaS business models.'],
    outcomes: ['Build a customer cohort tracker.'],
    createdAt: '2026-06-10T08:00:00Z',
    updatedAt: '2026-06-10T11:45:00Z',
    modules: [
      {
        id: 'rust-m1',
        title: 'Module 1: SaaS Analytics Setup',
        lessons: [
          {
            id: 'rust-m1-l1',
            title: 'SaaS funnel metrics overview',
            duration: '08:40',
            description: 'Understanding user flow from landing page to active client.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-ai-agent-architect',
    title: 'AI Agent Architect',
    slug: 'ai-agent-architect',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    description: 'Master the orchestration of multi-agent AI networks. Build self-correcting agents, write memory flows, and deploy autonomous workflows for coding and research.',
    shortDescription: 'Master multi-agent AI system design using CrewAI and AutoGen.',
    fullDescription: 'The future of AI is agentic. Simple chats are giving way to collaborative teams of autonomous agents that think, utilize tools, write code, and correct their own errors. In this advanced course, you will learn to build, orchestrate, and deploy multi-agent systems using industry-leading frameworks like CrewAI and AutoGen. By the end, you will build a fully automated research agent team that compiles detailed industry reports.',
    category: 'AI',
    difficulty: 'Advanced',
    level: 'Advanced',
    duration: '12h 45m',
    isFree: false,
    price: 39.00,
    originalPrice: 79.00,
    language: 'English',
    instructorName: 'Dr. Evelyn Sterling',
    instructorId: 'user-instructor',
    instructor: 'Dr. Evelyn Sterling',
    rating: 4.8,
    enrolledCount: 820,
    enrolledStudents: 820,
    certificateAvailable: true,
    status: 'published',
    tags: ['AI', 'Agents', 'CrewAI', 'AutoGen', 'Advanced'],
    requirements: [
      'Basic knowledge of Python (variables, loops, and functions).',
      'Understanding of API concepts.'
    ],
    outcomes: [
      'Orchestrate multiple AI agents to collaborate on complex tasks.',
      'Implement memory layers and tools for autonomous agents.',
      'Build agents capable of self-correcting and executing code.',
      'Deploy production-ready CrewAI and AutoGen agent flows.'
    ],
    createdAt: '2026-06-01T08:00:00Z',
    updatedAt: '2026-06-10T10:00:00Z',
    modules: [
      {
        id: 'agent-m1',
        title: 'Module 1: Agentic Patterns & Architectures',
        lessons: [
          {
            id: 'agent-m1-l1',
            title: 'Introduction to Agentic Workflows',
            duration: '12:15',
            description: 'Understand the transition from prompt engineering to agentic patterns: reflection, tool use, planning, and multi-agent collaboration.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['agentic-patterns-blueprint.pdf'],
            isPreview: true
          },
          {
            id: 'agent-m1-l2',
            title: 'CrewAI Architecture and Concepts',
            duration: '15:40',
            description: 'Master the core building blocks of CrewAI: Agents, Tasks, Crews, and Tools.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: ['crewai-starter-code.py']
          }
        ]
      },
      {
        id: 'agent-m2',
        title: 'Module 2: Tools, Memory & Planning',
        lessons: [
          {
            id: 'agent-m2-l1',
            title: 'Equipping Agents with Web Tools',
            duration: '18:20',
            description: 'Learn how to hook agents to search APIs, database connections, and custom script executors.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['custom-tools-template.py']
          },
          {
            id: 'agent-m2-l2',
            title: 'Long-Term and Short-Term Agent Memory',
            duration: '14:50',
            description: 'Configure vector stores and local database contexts to allow agents to persist state across runs.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: []
          }
        ]
      },
      {
        id: 'agent-m3',
        title: 'Module 3: Deploying Agentic Pipelines',
        lessons: [
          {
            id: 'agent-m3-l1',
            title: 'Running Agents in Background Cron Tasks',
            duration: '22:10',
            description: 'Deploy your multi-agent team to fly.io or a docker environment to execute tasks on triggers.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['dockerfile-spec.md']
          }
        ]
      }
    ],
    quiz: {
      id: 'quiz-ai-agent',
      title: 'AI Agent Architect Assessment',
      passingScore: 70,
      questions: [
        {
          id: 'q-agent-1',
          questionText: 'Which agentic pattern involves an agent reviewing its own output and refining it iteratively?',
          options: [
            'Tool use',
            'Self-reflection',
            'Few-shot learning',
            'Chain-of-thought'
          ],
          correctAnswerIndex: 1
        },
        {
          id: 'q-agent-2',
          questionText: 'In CrewAI, how are agent roles, goals, and backstories primarily passed to the model?',
          options: [
            'Through local database SQL queries',
            'As system prompts configured on agent instantiation',
            'In cookies stored on the client browser',
            'They are hardcoded in the CrewAI compiler'
          ],
          correctAnswerIndex: 1
        }
      ]
    }
  },
  {
    id: 'course-prompt-masterclass',
    title: 'Prompt Engineering Masterclass',
    slug: 'prompt-engineering-masterclass',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    description: 'Master advanced prompting techniques like Chain-of-Thought, ReAct, and Few-Shot learning. Optimize prompt performance for ChatGPT, Claude, and Llama.',
    shortDescription: 'Learn advanced prompt techniques for ChatGPT, Claude, and Llama.',
    fullDescription: 'Getting high-quality results from large language models is a science. In this hands-on class, you will go from basic chat queries to structuring programmatic, highly robust prompting templates. Learn the exact prompt variables, system rules, and structural guides used by AI engineers to build production applications.',
    category: 'AI',
    difficulty: 'Beginner',
    level: 'Beginner',
    duration: '5h 15m',
    isFree: true,
    price: 0.00,
    originalPrice: 29.00,
    language: 'English',
    instructorName: 'Dr. Evelyn Sterling',
    instructorId: 'user-instructor',
    instructor: 'Dr. Evelyn Sterling',
    rating: 4.7,
    enrolledCount: 2540,
    enrolledStudents: 2540,
    certificateAvailable: true,
    status: 'published',
    tags: ['AI', 'Prompt Engineering', 'ChatGPT', 'Claude', 'Beginner'],
    requirements: [
      'No programming experience needed.',
      'A web browser with access to ChatGPT or Claude.'
    ],
    outcomes: [
      'Understand LLM structures, temperature, and tokens.',
      'Write reliable system instructions for complex tasks.',
      'Implement Few-Shot, ReAct, and Chain-of-Thought prompting.',
      'Optimize prompts to prevent hallucinations and injection.'
    ],
    createdAt: '2026-06-03T08:00:00Z',
    updatedAt: '2026-06-11T12:00:00Z',
    modules: [
      {
        id: 'prompt-m1',
        title: 'Module 1: Prompt Anatomy & Variables',
        lessons: [
          {
            id: 'prompt-m1-l1',
            title: 'The Core Components of a Great Prompt',
            duration: '10:10',
            description: 'Break down a prompt into Instructions, Context, Input Data, and Output Indicators.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['prompt-anatomy-cheatsheet.pdf'],
            isPreview: true
          },
          {
            id: 'prompt-m1-l2',
            title: 'System Prompts vs. User Prompts',
            duration: '13:20',
            description: 'Learn how system prompts configure model behavior, persona, bounds, and output formats (JSON/Markdown).',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: []
          }
        ]
      },
      {
        id: 'prompt-m2',
        title: 'Module 2: Advanced Directives & Reasoning',
        lessons: [
          {
            id: 'prompt-m2-l1',
            title: 'Few-Shot Prompting Mechanics',
            duration: '15:45',
            description: 'How to provide clean, structured input-output examples to guide complex model outputs.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['few-shot-examples.txt']
          },
          {
            id: 'prompt-m2-l2',
            title: 'Chain-of-Thought and reasoning chains',
            duration: '18:15',
            description: 'Force the model to think step-by-step before answering, decreasing math and logic errors.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: []
          }
        ]
      }
    ],
    quiz: {
      id: 'quiz-prompt',
      title: 'Prompt Engineering Competency Test',
      passingScore: 70,
      questions: [
        {
          id: 'q-prompt-1',
          questionText: 'Which technique instructs the model to outline its reasoning steps before arriving at a final answer?',
          options: [
            'Zero-shot prompting',
            'Few-shot prompting',
            'Chain-of-Thought prompting',
            'Temperature scheduling'
          ],
          correctAnswerIndex: 2
        },
        {
          id: 'q-prompt-2',
          questionText: 'What is the risk of using too high a temperature setting in LLM queries?',
          options: [
            'The model will respond slower',
            'The outputs become highly random and prone to hallucination',
            'The input token count doubles',
            'The model will refuse to output markdown'
          ],
          correctAnswerIndex: 1
        }
      ]
    }
  },
  {
    id: 'course-langchain-llamaindex',
    title: 'LangChain & LlamaIndex: LLM App Development',
    slug: 'langchain-llamaindex-llm-app-development',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800',
    description: 'Build production-ready LLM applications. Master RAG (Retrieval-Augmented Generation), vector databases, memory buffers, chat interfaces, and complex tool chains.',
    shortDescription: 'Master RAG, vector databases, and LangChain tool orchestration.',
    fullDescription: 'Go beyond basic LLM prompts. Learn to connect your models to external data sources, orchestrate complex tasks, store embeddings in vector databases, and build smart agents. We walk through Retrieval-Augmented Generation (RAG) using LangChain and LlamaIndex to query custom PDFs, slide decks, and code repos in real time.',
    category: 'AI',
    difficulty: 'Advanced',
    level: 'Advanced',
    duration: '18h 30m',
    isFree: false,
    price: 59.00,
    originalPrice: 119.00,
    language: 'English',
    instructorName: 'Dr. Evelyn Sterling',
    instructorId: 'user-instructor',
    instructor: 'Dr. Evelyn Sterling',
    rating: 4.9,
    enrolledCount: 640,
    enrolledStudents: 640,
    certificateAvailable: true,
    status: 'published',
    tags: ['AI', 'LangChain', 'LlamaIndex', 'RAG', 'Vector Databases'],
    requirements: [
      'Comfortable with JavaScript or Python.',
      'Understanding of basic API keys and environment variables.'
    ],
    outcomes: [
      'Implement Retrieval-Augmented Generation (RAG) pipelines from scratch.',
      'Store, index, and query embeddings in Pinecone or ChromaDB.',
      'Build persistent memory architectures for multi-turn chat applications.',
      'Connect external search and coding tools to LLM models.',
      'Ship a production web app that chats with custom document uploads.'
    ],
    createdAt: '2026-06-05T08:00:00Z',
    updatedAt: '2026-06-11T14:00:00Z',
    modules: [
      {
        id: 'lc-m1',
        title: 'Module 1: Embeddings & Vector Stores',
        lessons: [
          {
            id: 'lc-m1-l1',
            title: 'Vector Embeddings Explained',
            duration: '12:30',
            description: 'Understand semantic similarity, cosine distance, and how chunks of text map to high-dimensional space.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['embeddings-visualized.pdf'],
            isPreview: true
          },
          {
            id: 'lc-m1-l2',
            title: 'Setting up Pinecone & ChromaDB',
            duration: '15:10',
            description: 'Initialize vector indices, write query metadata filters, and upload text embeddings.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: ['vector-db-setup.py']
          }
        ]
      },
      {
        id: 'lc-m2',
        title: 'Module 2: LangChain Orchestration',
        lessons: [
          {
            id: 'lc-m2-l1',
            title: 'Chains, Prompts, and Output Parsers',
            duration: '16:20',
            description: 'Construct multi-step pipelines where outputs of one model feed into another, enforced by strict schemas.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['langchain-templates.zip']
          },
          {
            id: 'lc-m2-l2',
            title: 'Retrieval Chains with LlamaIndex',
            duration: '22:45',
            description: 'Use LlamaIndex data connectors to ingest directories of Markdown, PDF, and code files for instant Q&A.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: ['llamaindex-rag-starter.py'],
            isPreview: true
          }
        ]
      }
    ],
    quiz: {
      id: 'quiz-langchain',
      title: 'LLM App Dev Competency Assessment',
      passingScore: 70,
      questions: [
        {
          id: 'q-lc-1',
          questionText: 'What does RAG stand for in the context of Large Language Models?',
          options: [
            'Response Analysis and Generation',
            'Retrieval-Augmented Generation',
            'Relational Active Gradients',
            'Randomized Attribute Grids'
          ],
          correctAnswerIndex: 1
        },
        {
          id: 'q-lc-2',
          questionText: 'What is the main role of a Vector Database in a RAG system?',
          options: [
            'To store the system configuration properties',
            'To perform semantic search and retrieve relevant text chunks fast',
            'To translate programming languages',
            'To render web app dashboards'
          ],
          correctAnswerIndex: 1
        }
      ]
    }
  },
  {
    id: 'course-finetuning-llms',
    title: 'Fine-Tuning LLMs: Custom Model Training',
    slug: 'finetuning-llms-custom-model-training',
    thumbnail: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
    description: 'Learn to fine-tune open-source models (Llama, Mistral) on your custom datasets. Master LoRA, QLoRA, data formatting, training compute setup, and model evaluation.',
    shortDescription: 'Fine-tune Llama and Mistral using LoRA, QLoRA, and custom datasets.',
    fullDescription: 'General models are great, but custom models tailored to specific codebases or enterprise vocabularies win. In this course, you will learn to prepare high-quality training datasets, structure instruction-tuning formats, and run fine-tuning jobs on open-source LLMs using LoRA (Low-Rank Adaptation) and QLoRA. Walk through training runs on cloud GPUs and deploy the final model weights.',
    category: 'AI',
    difficulty: 'Advanced',
    level: 'Advanced',
    duration: '14h 15m',
    isFree: false,
    price: 69.00,
    originalPrice: 149.00,
    language: 'English',
    instructorName: 'Dr. Evelyn Sterling',
    instructorId: 'user-instructor',
    instructor: 'Dr. Evelyn Sterling',
    rating: 4.9,
    enrolledCount: 380,
    enrolledStudents: 380,
    certificateAvailable: true,
    status: 'published',
    tags: ['AI', 'Fine-Tuning', 'LoRA', 'QLoRA', 'Llama', 'Mistral'],
    requirements: [
      'Intermediate Python programming skills.',
      'Understanding of basic Machine Learning concepts (loss, training loops).'
    ],
    outcomes: [
      'Prepare instruction and completion datasets for model training.',
      'Configure QLoRA hyperparameters to optimize GPU memory usage.',
      'Run training scripts using PyTorch and HuggingFace Transformers.',
      'Evaluate and contrast custom fine-tuned models against baseline models.',
      'Deploy fine-tuned model weights to HuggingFace or locally.'
    ],
    createdAt: '2026-06-08T08:00:00Z',
    updatedAt: '2026-06-11T15:00:00Z',
    modules: [
      {
        id: 'ft-m1',
        title: 'Module 1: Dataset Preparation',
        lessons: [
          {
            id: 'ft-m1-l1',
            title: 'Instruction Tuning Dataset Formats',
            duration: '14:20',
            description: 'Understand Alpaca vs. ShareGPT formats, parsing raw transcripts, and cleaning training samples.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            resources: ['dataset-templates.json'],
            isPreview: true
          }
        ]
      },
      {
        id: 'ft-m2',
        title: 'Module 2: LoRA & QLoRA Mechanics',
        lessons: [
          {
            id: 'ft-m2-l1',
            title: 'Low-Rank Adaptation LoRA Explained',
            duration: '18:40',
            description: 'Learn how low-rank adaptation freezes baseline weights and inserts tiny trainable layers to reduce compute costs.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: ['lora-hyperparams-cheatsheet.pdf']
          }
        ]
      }
    ],
    quiz: {
      id: 'quiz-finetuning',
      title: 'Fine-Tuning Competency Assessment',
      passingScore: 70,
      questions: [
        {
          id: 'q-ft-1',
          questionText: 'What is the primary benefit of using QLoRA over traditional full-parameter fine-tuning?',
          options: [
            'It speeds up training by 100x',
            'It dramatically reduces the required GPU memory, allowing training on consumer hardware',
            'It guarantees zero hallucination',
            'It works without training datasets'
          ],
          correctAnswerIndex: 1
        }
      ]
    }
  }
];
