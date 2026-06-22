import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { Course } from '../models/Course.model';

const seedResources = async () => {
  try {
    // 1. Connect to DB
    await connectDB();

    console.log('📚 Checking existing Learning Library resources...');
    
    const resources = [
      {
        title: 'Become An AI Builder In 30 Days — Starter Guide',
        slug: 'ai-builder-30-days',
        shortDescription: 'A practical roadmap to building AI applications in 30 days without prior AI experience.',
        description: 'This starter guide breaks down the core concepts of prompt engineering, LLM integration, and AI app architecture into a 30-day practical journey.',
        category: 'AI',
        level: 'beginner',
        type: 'guide',
        accessType: 'read_online',
        readingTime: 45,
        author: 'Veloria Academy',
        thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600',
        status: 'published',
        liveClassStatus: 'coming_soon',
        tags: ['AI', 'Guide', 'Beginner'],
        outcomes: ['Understand core AI concepts', 'Build your first LLM app', 'Navigate the AI ecosystem'],
      },
      {
        title: 'Prompt Engineering Practical Handbook',
        slug: 'prompt-engineering-handbook',
        shortDescription: 'Master the art of communicating with large language models to get precise, predictable outputs.',
        description: 'A comprehensive handbook covering zero-shot, few-shot, and chain-of-thought prompting techniques with practical examples.',
        category: 'AI',
        level: 'intermediate',
        type: 'book',
        accessType: 'read_online',
        readingTime: 120,
        author: 'Veloria Academy',
        thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600',
        status: 'published',
        liveClassStatus: 'coming_soon',
        tags: ['AI', 'Prompting', 'Handbook'],
        outcomes: ['Write effective prompts', 'Reduce LLM hallucinations', 'Implement prompt templates'],
      },
      {
        title: 'MVP Engineering Blueprint',
        slug: 'mvp-engineering-blueprint',
        shortDescription: 'How to build and launch your Minimum Viable Product in weeks, not months.',
        description: 'An actionable blueprint detailing tech stack selection, core feature prioritization, and rapid deployment strategies for startups.',
        category: 'Engineering',
        level: 'intermediate',
        type: 'pdf',
        accessType: 'download_pdf',
        readingTime: 60,
        author: 'Veloria Academy',
        thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
        status: 'published',
        liveClassStatus: 'coming_soon',
        tags: ['MVP', 'Startups', 'Blueprint'],
        outcomes: ['Scope an MVP correctly', 'Choose the right tech stack', 'Launch quickly'],
      },
      {
        title: 'React Native Basics Notes',
        slug: 'react-native-basics',
        shortDescription: 'Quick reference notes for building cross-platform mobile apps with React Native.',
        description: 'A concise collection of code snippets, navigation patterns, and state management techniques for React Native developers.',
        category: 'Mobile',
        level: 'beginner',
        type: 'pdf',
        accessType: 'read_online',
        readingTime: 30,
        author: 'Veloria Academy',
        thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600',
        status: 'published',
        liveClassStatus: 'coming_soon',
        tags: ['React Native', 'Mobile', 'Notes'],
        outcomes: ['Understand React Native architecture', 'Implement basic navigation', 'Build UI components'],
      },
      {
        title: 'Content Creation Playbook',
        slug: 'content-creation-playbook',
        shortDescription: 'Strategies for consistently creating engaging technical content and building an audience.',
        description: 'A practical playbook covering content ideation, writing technical articles, and leveraging social media for developers.',
        category: 'Marketing',
        level: 'beginner',
        type: 'guide',
        accessType: 'read_online',
        readingTime: 50,
        author: 'Veloria Academy',
        thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600',
        status: 'published',
        liveClassStatus: 'coming_soon',
        tags: ['Content', 'Marketing', 'Playbook'],
        outcomes: ['Generate content ideas', 'Write engaging tech articles', 'Grow an audience'],
      },
      {
        title: 'UI/UX Design Foundations PDF',
        slug: 'ui-ux-foundations',
        shortDescription: 'Essential design principles every developer should know to build beautiful interfaces.',
        description: 'A comprehensive guide to color theory, typography, spacing, and user experience patterns for non-designers.',
        category: 'Design',
        level: 'beginner',
        type: 'pdf',
        accessType: 'download_pdf',
        readingTime: 90,
        author: 'Veloria Academy',
        thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
        status: 'published',
        liveClassStatus: 'coming_soon',
        tags: ['UI', 'UX', 'Design'],
        outcomes: ['Understand color and typography', 'Design accessible interfaces', 'Improve user experience'],
      },
      {
        title: 'Cybersecurity Basics for Beginners',
        slug: 'cybersecurity-basics',
        shortDescription: 'A foundational guide to protecting applications and user data from common threats.',
        description: 'Learn about OWASP Top 10 vulnerabilities, secure coding practices, and basic encryption concepts.',
        category: 'Security',
        level: 'beginner',
        type: 'book',
        accessType: 'read_online',
        readingTime: 110,
        author: 'Veloria Academy',
        thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600',
        status: 'published',
        liveClassStatus: 'coming_soon',
        tags: ['Security', 'Cybersecurity', 'Basics'],
        outcomes: ['Identify common vulnerabilities', 'Implement secure coding practices', 'Understand basic cryptography'],
      },
      {
        title: 'Web Development Roadmap PDF',
        slug: 'web-dev-roadmap',
        shortDescription: 'A step-by-step visual roadmap to becoming a full-stack web developer in 2026.',
        description: 'A detailed map of technologies to learn, from HTML/CSS to advanced backend patterns and cloud deployment.',
        category: 'Web',
        level: 'beginner',
        type: 'pdf',
        accessType: 'download_pdf',
        readingTime: 20,
        author: 'Veloria Academy',
        thumbnailUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600',
        status: 'published',
        liveClassStatus: 'coming_soon',
        tags: ['Roadmap', 'Web Dev', 'Career'],
        outcomes: ['Plan your learning journey', 'Understand full-stack architecture', 'Discover modern tech stacks'],
      }
    ];

    let insertedCount = 0;
    for (const resource of resources) {
      const existing = await Course.findOne({ slug: resource.slug });
      if (!existing) {
        // Find admin user to set as creator
        const adminUser = await mongoose.model('User').findOne({ role: 'admin' });
        
        await Course.create({
          ...resource,
          instructorId: adminUser ? adminUser._id : null,
          price: 0,
          modules: [],
        });
        insertedCount++;
        console.log(`✅ Inserted: ${resource.title}`);
      } else {
        // Update existing to ensure type and liveClassStatus are correct
        await Course.updateOne(
          { slug: resource.slug }, 
          { 
            $set: { 
              type: resource.type, 
              accessType: resource.accessType,
              liveClassStatus: resource.liveClassStatus,
              readingTime: resource.readingTime,
              author: resource.author
            } 
          }
        );
        console.log(`🔄 Updated existing: ${resource.title}`);
      }
    }

    // Clean up fake "SaaS Dashboard Design" and "Bento Design System" only if they exist and we're seeding for the first time
    const fakeSlugs = [
      'saas-dashboard-design', 
      'bento-grid-mastery', 
      'fullstack-web-dev', 
      'advanced-system-architecture',
      'design-systems-scale'
    ];
    
    const result = await Course.deleteMany({ slug: { $in: fakeSlugs } });
    if (result.deletedCount > 0) {
      console.log(`🗑️ Removed ${result.deletedCount} old fake demo courses.`);
    }

    console.log(`\n🎉 Seed complete! Inserted ${insertedCount} new resources.`);
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedResources();
