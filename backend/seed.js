const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course'); 

dotenv.config();

const coursesToSeed = [
  {
    id: '1',
    title: 'Complete MERN Stack Web Development Bootcamp',
    instructor: 'Smriti R.',
    instructorTitle: 'Full Stack Developer',
    price: 49.99,
    originalPrice: 199.99, // DISCOUNTED
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
          { id: 'l1-2', title: 'React Project Structure', duration: '15:20', type: 'video', videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk' },
          { id: 'l1-3', title: 'Introduction to NPM', duration: '08:45', type: 'video', videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4' },
          { id: 'l1-4', title: 'Vite vs Create React App', duration: '12:10', type: 'video', videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M' }
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
    price: 0, 
    originalPrice: 0, // FREE - NO OFFERS
    rating: 4.9,
    reviewCount: 8920,
    students: 31050,
    duration: '35 hours',
    level: 'Intermediate',
    category: 'Data Science',
    description: 'Master NumPy, Pandas, and Scikit-Learn for data analysis.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bb8c803er9a8?w=800',
    videoUrl: 'https://www.youtube.com/embed/edvg4eHi_Mw',
    lastUpdated: '2026-02-10',
    isBestseller: true,
    curriculum: [
      {
        id: 'm2-1',
        title: 'Module 1: Foundations',
        lessons: [
          { id: 'l2-1', title: 'Intro to NumPy', duration: '15:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/QUT1VHiLmmI' },
          { id: 'l2-2', title: 'Pandas DataFrames', duration: '20:45', type: 'video', videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg' },
          { id: 'l2-3', title: 'Data Cleaning Basics', duration: '12:30', type: 'video', videoUrl: 'https://www.youtube.com/embed/QUT1VHiLmmI' },
          { id: 'l2-4', title: 'Matplotlib Essentials', duration: '18:15', type: 'video', videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg' }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Advanced React with TypeScript',
    instructor: 'Alex Rivera',
    instructorTitle: 'Frontend Architect',
    price: 24.99,
    originalPrice: 24.99, // FULL PRICE - NO OFFERS
    rating: 4.7,
    reviewCount: 5430,
    students: 12100,
    duration: '18 hours',
    level: 'Advanced',
    category: 'Web Development',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    videoUrl: 'https://www.youtube.com/embed/hyK46Vv80nE',
    isBestseller: false,
    curriculum: [
      {
        id: 'm3-1',
        title: 'Module 1: Integration',
        lessons: [
          { id: 'l3-1', title: 'Typing Props & State', duration: '12:45', type: 'video', videoUrl: 'https://www.youtube.com/embed/zQnBQ4tB3ZA' },
          { id: 'l3-2', title: 'TypeScript Utility Types', duration: '15:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/3S_u159Dndw' },
          { id: 'l3-3', title: 'Generics in React', duration: '22:10', type: 'video', videoUrl: 'https://www.youtube.com/embed/zQnBQ4tB3ZA' },
          { id: 'l3-4', title: 'Ref hooks with TS', duration: '14:30', type: 'video', videoUrl: 'https://www.youtube.com/embed/3S_u159Dndw' }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'UI/UX Design Essentials',
    instructor: 'Elena Gomez',
    instructorTitle: 'Senior Product Designer',
    price: 0,
    originalPrice: 0, // FREE
    rating: 4.8,
    reviewCount: 3210,
    students: 9500,
    duration: '22 hours',
    level: 'Beginner',
    category: 'Design',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    videoUrl: 'https://www.youtube.com/embed/Gu1asid3_Kk',
    isBestseller: true,
    curriculum: [
      {
        id: 'm4-1',
        title: 'Module 1: Design Thinking',
        lessons: [
          { id: 'l4-1', title: 'User Research Basics', duration: '20:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/zHAa-m16NGk' },
          { id: 'l4-2', title: 'Typography & Hierarchy', duration: '18:30', type: 'video', videoUrl: 'https://www.youtube.com/embed/09m_pS_A_uI' },
          { id: 'l4-3', title: 'Color Theory', duration: '15:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/zHAa-m16NGk' },
          { id: 'l4-4', title: 'Grid Systems', duration: '12:45', type: 'video', videoUrl: 'https://www.youtube.com/embed/09m_pS_A_uI' }
        ]
      }
    ]
  },
  {
    id: '5',
    title: 'Node.js Backend Architecture',
    instructor: 'Marcus Chen',
    instructorTitle: 'Systems Engineer',
    price: 54.99,
    originalPrice: 149.99, // DISCOUNTED
    rating: 4.6,
    reviewCount: 2100,
    students: 7200,
    duration: '30 hours',
    level: 'Intermediate',
    category: 'Web Development',
    imageUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800',
    videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4',
    isBestseller: false,
    curriculum: [
      {
        id: 'm5-1',
        title: 'Module 1: Server Internals',
        lessons: [
          { id: 'l5-1', title: 'The Event Loop', duration: '45:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/8aGhZQkoFbQ' },
          { id: 'l5-2', title: 'Streams and Buffers', duration: '30:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/8aGhZQkoFbQ' },
          { id: 'l5-3', title: 'Cluster Module', duration: '20:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/8aGhZQkoFbQ' },
          { id: 'l5-4', title: 'Child Processes', duration: '25:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/8aGhZQkoFbQ' }
        ]
      }
    ]
  },
  {
    id: '6',
    title: 'AWS Cloud Practitioner Prep',
    instructor: 'David Miller',
    instructorTitle: 'Cloud Solutions Architect',
    price: 15.99,
    originalPrice: 15.99, // FULL PRICE - NO OFFERS
    rating: 4.9,
    reviewCount: 15400,
    students: 68000,
    duration: '12 hours',
    level: 'Beginner',
    category: 'Cloud Computing',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    videoUrl: 'https://www.youtube.com/embed/TszvS_P7WJk',
    isBestseller: true,
    curriculum: [
      {
        id: 'm6-1',
        title: 'Module 1: Core Services',
        lessons: [
          { id: 'l6-1', title: 'Intro to S3', duration: '08:30', type: 'video', videoUrl: 'https://www.youtube.com/embed/TszvS_P7WJk' },
          { id: 'l6-2', title: 'EC2 Basics', duration: '12:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/TszvS_P7WJk' },
          { id: 'l6-3', title: 'IAM Roles', duration: '10:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/TszvS_P7WJk' },
          { id: 'l6-4', title: 'VPC Networking', duration: '15:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/TszvS_P7WJk' }
        ]
      }
    ]
  },
  {
    id: '7',
    title: 'Full-Stack Next.js 14 Masterclass',
    instructor: 'Jordan Lee',
    instructorTitle: 'Full Stack Mentor',
    price: 0,
    originalPrice: 0, // FREE
    rating: 4.8,
    reviewCount: 4200,
    students: 15000,
    duration: '28 hours',
    level: 'Intermediate',
    category: 'Web Development',
    imageUrl: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800',
    videoUrl: 'https://www.youtube.com/embed/wm5gMKuwSYk',
    isBestseller: true,
    curriculum: [
      {
        id: 'm7-1',
        title: 'Module 1: Data Fetching',
        lessons: [
          { id: 'l7-1', title: 'Server Actions', duration: '22:15', type: 'video', videoUrl: 'https://www.youtube.com/embed/wm5gMKuwSYk' },
          { id: 'l7-2', title: 'Static vs Dynamic Rendering', duration: '18:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/wm5gMKuwSYk' },
          { id: 'l7-3', title: 'Caching Strategies', duration: '15:30', type: 'video', videoUrl: 'https://www.youtube.com/embed/wm5gMKuwSYk' },
          { id: 'l7-4', title: 'Middleware in Next.js', duration: '12:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/wm5gMKuwSYk' }
        ]
      }
    ]
  },
  {
    id: '8',
    title: 'Cybersecurity Fundamentals',
    instructor: 'Robert Vance',
    instructorTitle: 'Ethical Hacker',
    price: 29.99,
    originalPrice: 149.99, // DISCOUNTED
    rating: 4.7,
    reviewCount: 6100,
    students: 22000,
    duration: '20 hours',
    level: 'Beginner',
    category: 'Security',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    videoUrl: 'https://www.youtube.com/embed/6GGz6itvOlk',
    isBestseller: false,
    curriculum: [
      {
        id: 'm8-1',
        title: 'Module 1: Web Security',
        lessons: [
          { id: 'l8-1', title: 'Preventing XSS', duration: '18:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/6GGz6itvOlk' },
          { id: 'l8-2', title: 'SQL Injection Defense', duration: '20:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/6GGz6itvOlk' },
          { id: 'l8-3', title: 'CSRF Protection', duration: '15:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/6GGz6itvOlk' },
          { id: 'l8-4', title: 'Auth Security', duration: '25:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/6GGz6itvOlk' }
        ]
      }
    ]
  },
  {
    id: '9',
    title: 'Mobile App Development with Flutter',
    instructor: 'Samantha Ray',
    instructorTitle: 'Mobile Developer',
    price: 34.99,
    originalPrice: 34.99, // FULL PRICE - NO OFFERS
    rating: 4.6,
    reviewCount: 2800,
    students: 11500,
    duration: '32 hours',
    level: 'Beginner',
    category: 'Mobile Development',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8',
    isBestseller: false,
    curriculum: [
      {
        id: 'm9-1',
        title: 'Module 1: Dart Basics',
        lessons: [
          { id: 'l9-1', title: 'Classes & Objects', duration: '25:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8' },
          { id: 'l9-2', title: 'Dart Collections', duration: '20:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8' },
          { id: 'l9-3', title: 'Async/Await in Dart', duration: '15:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8' },
          { id: 'l9-4', title: 'Dart Type System', duration: '12:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8' }
        ]
      }
    ]
  },
  {
    id: '10',
    title: 'Mastering SQL and PostgreSQL',
    instructor: 'Liam O’Donnell',
    instructorTitle: 'Database Administrator',
    price: 0,
    originalPrice: 0, // FREE
    rating: 4.9,
    reviewCount: 9300,
    students: 40000,
    duration: '15 hours',
    level: 'Beginner',
    category: 'Database',
    imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
    videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY',
    isBestseller: true,
    curriculum: [
      {
        id: 'm10-1',
        title: 'Module 1: Querying Data',
        lessons: [
          { id: 'l10-1', title: 'Outer Joins Explained', duration: '14:20', type: 'video', videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY' },
          { id: 'l10-2', title: 'Subqueries Mastery', duration: '18:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY' },
          { id: 'l10-3', title: 'Aggregations and Groups', duration: '15:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY' },
          { id: 'l10-4', title: 'Indexing for Speed', duration: '10:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY' }
        ]
      }
    ]
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