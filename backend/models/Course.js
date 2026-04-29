const mongoose = require('mongoose');

// Matches your "Lesson" interface
const lessonSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['video', 'quiz', 'reading'], 
    default: 'video' 
  },
  videoUrl: String
});

// Matches your "Module" interface
const moduleSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  lessons: [lessonSchema]
});

// Matches your "Course" interface
const courseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // The '1', '2', '3'...
  title: { type: String, required: true },
  instructor: { type: String, required: true },
  instructorTitle: String,
  price: { type: Number, required: true },
  originalPrice: Number,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  students: { type: Number, default: 0 },
  duration: String,
  level: String,
  category: String,
  description: String,
  imageUrl: String,
  lastUpdated: String,
  language: { type: String, default: 'English' },
  isBestseller: { type: Boolean, default: false },
  whatYouLearn: [String],
  requirements: [String],
  curriculum: [moduleSchema],
  videoUrl: String, // The main preview video
  quiz: [{
    question: String,
    options: [String],
    correctAnswer: Number
  }]
}, { 
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Course', courseSchema);