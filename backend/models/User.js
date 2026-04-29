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
    trim: true // Added trim to prevent "space" errors
  },
  password: { 
    type: String, 
    required: true 
  },
  
 // Inside User.js
enrolledCourses: [
  {
    courseId: { 
      type: mongoose.Schema.Types.ObjectId, // Use MongoDB _id for references
      ref: 'Course' // This MUST match the name in module.exports = mongoose.model('Course', ...)
    },
    progress: { type: Number, default: 0 }
  }
],
  
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  }

}, { timestamps: true });

// Exporting the Model
module.exports = mongoose.model("User", userSchema);