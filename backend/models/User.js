const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  
  enrolledCourses: [
    {
      courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course' 
      },
      progress: { type: Number, default: 0 }
    }
  ],
  
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'], // Added 'instructor'
    default: 'student'
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);