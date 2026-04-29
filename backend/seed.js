const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course'); // Ensure this path matches your folder structure

dotenv.config();

const coursesToSeed = [
  {
    id: '1',
    title: 'Complete MERN Stack Web Development Bootcamp',
    instructor: 'Sarah Johnson',
    instructorTitle: 'Full Stack Developer',
    price: 49.99,
    originalPrice: 199.99,
    rating: 4.8,
    reviewCount: 12453,
    students: 45230,
    duration: '42 hours',
    level: 'Beginner',
    category: 'Web Development',
    description: 'Build full-stack apps with MongoDB, Express, React, and Node.js from scratch.',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M',
    lastUpdated: '2026-03-15',
    language: 'English',
    isBestseller: true,
    whatYouLearn: ['React Hooks & Context API', 'RESTful API Design', 'MongoDB CRUD Operations'],
    requirements: ['Basic HTML/CSS knowledge', 'JavaScript fundamentals'],
    curriculum: [
      {
        id: 'm1-1',
        title: 'Module 1: Getting Started',
        lessons: [
          { id: 'l1-1', title: 'Setup Environment', duration: '10:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M' },
          { id: 'l1-2', title: 'React Project Structure', duration: '15:20', type: 'video', videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk' }
        ]
      },
      {
        id: 'm1-2',
        title: 'Module 2: Backend with Express',
        lessons: [
          { id: 'l1-3', title: 'Creating your first API', duration: '22:10', type: 'video', videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4' }
        ]
      }
    ],
    quiz: [{ question: "What does the 'R' in MERN stand for?", options: ["Ruby", "React", "Rust", "Redux"], correctAnswer: 1 }]
  },
  {
    id: '2',
    title: 'Python for Data Science and Machine Learning',
    instructor: 'Dr. Michael Smith',
    instructorTitle: 'Data Scientist',
    price: 39.99,
    originalPrice: 159.99,
    rating: 4.9,
    reviewCount: 8920,
    students: 31050,
    duration: '35 hours',
    level: 'Intermediate',
    category: 'Data Science',
    description: 'Master NumPy, Pandas, and Scikit-Learn for data analysis and predictive modeling.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bb8c803er9a8?w=800',
    videoUrl: 'https://www.youtube.com/embed/edvg4eHi_Mw',
    lastUpdated: '2026-02-10',
    language: 'English',
    isBestseller: true,
    whatYouLearn: ['Data Visualization', 'Statistical Analysis', 'Linear Regression'],
    requirements: ['Basic Python programming'],
    curriculum: [
      {
        id: 'm2-1',
        title: 'Module 1: Foundations',
        lessons: [
          { id: 'l2-1', title: 'Intro to NumPy', duration: '15:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/QUT1VHiLmmI' },
          { id: 'l2-2', title: 'Pandas DataFrames', duration: '20:45', type: 'video', videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg' }
        ]
      }
    ],
    quiz: [{ question: "Which library is used for multi-dimensional arrays?", options: ["Pandas", "Matplotlib", "NumPy", "Flask"], correctAnswer: 2 }]
  },
  {
    id: '3',
    title: 'Advanced React with TypeScript',
    instructor: 'Alex Rivera',
    instructorTitle: 'Frontend Architect',
    price: 24.99,
    originalPrice: 89.99,
    rating: 4.7,
    reviewCount: 5430,
    students: 12100,
    duration: '18 hours',
    level: 'Advanced',
    category: 'Web Development',
    description: 'Build enterprise-grade applications with strict typing.',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    videoUrl: 'https://www.youtube.com/embed/hyK46Vv80nE',
    lastUpdated: '2026-04-01',
    language: 'English',
    isBestseller: false,
    whatYouLearn: ['Generics in React', 'Custom Hooks with TS', 'State Management Design'],
    requirements: ['Intermediate React', 'Basic TypeScript'],
    curriculum: [
      {
        id: 'm3-1',
        title: 'Module 1: Integration',
        lessons: [
          { id: 'l3-1', title: 'Typing Props & State', duration: '12:45', type: 'video', videoUrl: 'https://www.youtube.com/embed/zQnBQ4tB3ZA' },
          { id: 'l3-2', title: 'TypeScript Utility Types', duration: '15:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/3S_u159Dndw' }
        ]
      }
    ],
    quiz: [{ question: "How do you denote an optional property?", options: ["property!", "property?", "property??", "prop: optional"], correctAnswer: 1 }]
  },
  {
    id: '4',
    title: 'UI/UX Design Essentials',
    instructor: 'Elena Gomez',
    instructorTitle: 'Senior Product Designer',
    price: 19.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviewCount: 3210,
    students: 9500,
    duration: '22 hours',
    level: 'Beginner',
    category: 'Design',
    description: 'Learn Figma, wireframing, and user-centered design principles.',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    videoUrl: 'https://www.youtube.com/embed/Gu1asid3_Kk',
    lastUpdated: '2026-01-20',
    language: 'English',
    isBestseller: true,
    whatYouLearn: ['Prototyping in Figma', 'Color Theory', 'Mobile-First Design'],
    requirements: ['No prior experience needed'],
    curriculum: [
      {
        id: 'm4-1',
        title: 'Module 1: Design Thinking',
        lessons: [
          { id: 'l4-1', title: 'User Research Basics', duration: '20:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/zHAa-m16NGk' },
          { id: 'l4-2', title: 'Typography & Hierarchy', duration: '18:30', type: 'video', videoUrl: 'https://www.youtube.com/embed/09m_pS_A_uI' }
        ]
      }
    ],
    quiz: [{ question: "Purpose of low-fidelity wireframes?", options: ["Visual detail", "Final layout", "Structure & flow", "User testing"], correctAnswer: 2 }]
  },
  {
    id: '5',
    title: 'Node.js Backend Architecture',
    instructor: 'Marcus Chen',
    instructorTitle: 'Systems Engineer',
    price: 54.99,
    originalPrice: 149.99,
    rating: 4.6,
    reviewCount: 2100,
    students: 7200,
    duration: '30 hours',
    level: 'Intermediate',
    category: 'Web Development',
    description: 'Deep dive into microservices and event loops.',
    imageUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800',
    videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4',
    lastUpdated: '2026-03-05',
    language: 'English',
    isBestseller: false,
    whatYouLearn: ['Microservices Patterns', 'Redis Caching', 'Dockerization'],
    requirements: ['Basic Node.js and Express'],
    curriculum: [
      {
        id: 'm5-1',
        title: 'Module 1: Server Internals',
        lessons: [{ id: 'l5-1', title: 'The Event Loop', duration: '45:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/8aGhZQkoFbQ' }]
      }
    ],
    quiz: [{ question: "Is Node.js single-threaded?", options: ["Single-threaded", "Multi-threaded", "Both", "Neither"], correctAnswer: 0 }]
  },
  {
    id: '6',
    title: 'AWS Cloud Practitioner Prep',
    instructor: 'David Miller',
    instructorTitle: 'Cloud Solutions Architect',
    price: 15.99,
    originalPrice: 99.99,
    rating: 4.9,
    reviewCount: 15400,
    students: 68000,
    duration: '12 hours',
    level: 'Beginner',
    category: 'Cloud Computing',
    description: 'Learn the fundamentals of Amazon Web Services.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    videoUrl: 'https://www.youtube.com/embed/TszvS_P7WJk',
    lastUpdated: '2026-04-05',
    language: 'English',
    isBestseller: true,
    whatYouLearn: ['EC2 & S3 Basics', 'Cloud Security', 'Billing & Pricing'],
    requirements: ['General IT knowledge'],
    curriculum: [
      {
        id: 'm6-1',
        title: 'Module 1: Core Services',
        lessons: [{ id: 'l6-1', title: 'Intro to S3', duration: '08:30', type: 'video', videoUrl: 'https://www.youtube.com/embed/TszvS_P7WJk' }]
      }
    ],
    quiz: [{ question: "AWS service for object storage?", options: ["EC2", "RDS", "S3", "IAM"], correctAnswer: 2 }]
  },
  {
    id: '7',
    title: 'Full-Stack Next.js 14 Masterclass',
    instructor: 'Jordan Lee',
    instructorTitle: 'Full Stack Mentor',
    price: 44.99,
    originalPrice: 179.99,
    rating: 4.8,
    reviewCount: 4200,
    students: 15000,
    duration: '28 hours',
    level: 'Intermediate',
    category: 'Web Development',
    description: 'Learn App Router, Server Actions, and SSR.',
    imageUrl: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800',
    videoUrl: 'https://www.youtube.com/embed/wm5gMKuwSYk',
    lastUpdated: '2026-03-25',
    language: 'English',
    isBestseller: true,
    whatYouLearn: ['App Router', 'Server Components', 'SEO for Next.js'],
    requirements: ['Modern React knowledge'],
    curriculum: [
      {
        id: 'm7-1',
        title: 'Module 1: Data Fetching',
        lessons: [{ id: 'l7-1', title: 'Server Actions', duration: '22:15', type: 'video', videoUrl: 'https://www.youtube.com/embed/wm5gMKuwSYk' }]
      }
    ],
    quiz: [{ question: "Next.js 14 routing directory?", options: ["/pages", "/routes", "/app", "/src"], correctAnswer: 2 }]
  },
  {
    id: '8',
    title: 'Cybersecurity Fundamentals',
    instructor: 'Robert Vance',
    instructorTitle: 'Ethical Hacker',
    price: 29.99,
    originalPrice: 149.99,
    rating: 4.7,
    reviewCount: 6100,
    students: 22000,
    duration: '20 hours',
    level: 'Beginner',
    category: 'Security',
    description: 'Protect applications from SQL Injection and XSS.',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    videoUrl: 'https://www.youtube.com/embed/6GGz6itvOlk',
    lastUpdated: '2026-02-15',
    language: 'English',
    isBestseller: false,
    whatYouLearn: ['Penetration Testing', 'Network Security', 'OWASP Top 10'],
    requirements: ['Basic networking knowledge'],
    curriculum: [
      {
        id: 'm8-1',
        title: 'Module 1: Web Security',
        lessons: [{ id: 'l8-1', title: 'Preventing XSS', duration: '18:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/6GGz6itvOlk' }]
      }
    ],
    quiz: [{ question: "What does XSS stand for?", options: ["Extra Server Security", "Cross-Site Scripting", "XML Script Search", "External System Setup"], correctAnswer: 1 }]
  },
  {
    id: '9',
    title: 'Mobile App Development with Flutter',
    instructor: 'Samantha Ray',
    instructorTitle: 'Mobile Developer',
    price: 34.99,
    originalPrice: 139.99,
    rating: 4.6,
    reviewCount: 2800,
    students: 11500,
    duration: '32 hours',
    level: 'Beginner',
    category: 'Mobile Development',
    description: 'Build native iOS and Android apps from a single codebase.',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8',
    lastUpdated: '2026-03-30',
    language: 'English',
    isBestseller: false,
    whatYouLearn: ['Dart Language', 'Stateful Widgets', 'Flutter UI animations'],
    requirements: ['Object-oriented programming basics'],
    curriculum: [
      {
        id: 'm9-1',
        title: 'Module 1: Dart Basics',
        lessons: [{ id: 'l9-1', title: 'Classes & Objects', duration: '25:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8' }]
      }
    ],
    quiz: [{ question: "Language used to write Flutter apps?", options: ["Swift", "Java", "Dart", "Kotlin"], correctAnswer: 2 }]
  },
  {
    id: '10',
    title: 'Mastering SQL and PostgreSQL',
    instructor: 'Liam O’Donnell',
    instructorTitle: 'Database Administrator',
    price: 12.99,
    originalPrice: 79.99,
    rating: 4.9,
    reviewCount: 9300,
    students: 40000,
    duration: '15 hours',
    level: 'Beginner',
    category: 'Database',
    description: 'Write complex queries and optimize database performance.',
    imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
    videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY',
    lastUpdated: '2026-01-10',
    language: 'English',
    isBestseller: true,
    whatYouLearn: ['Joins & Subqueries', 'Database Indexing', 'Schema Design'],
    requirements: ['No prior database experience'],
    curriculum: [
      {
        id: 'm10-1',
        title: 'Module 1: Querying Data',
        lessons: [{ id: 'l10-1', title: 'Outer Joins Explained', duration: '14:20', type: 'video', videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY' }]
      }
    ],
    quiz: [{ question: "Command to remove all records?", options: ["DELETE", "DROP", "TRUNCATE", "REMOVE"], correctAnswer: 2 }]
  }
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("Clearing existing courses...");
    await Course.deleteMany();

    console.log("Inserting 10 new courses...");
    await Course.insertMany(coursesToSeed);

    console.log("✅ Database Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();