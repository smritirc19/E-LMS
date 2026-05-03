const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// 1. Enroll in a course (Student)
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    const newEnrollment = new Enrollment({
      user: userId,
      course: courseId,
      status: 'active'
    });

    await newEnrollment.save();
    res.status(201).json({ success: true, enrollment: newEnrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Complete a course (Student)
const completeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOneAndUpdate(
      { user: userId, course: courseId },
      { progress: 100, status: 'completed', completedAt: Date.now() },
      { new: true }
    );

    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    res.status(200).json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Create a course (Instructor)
const createCourse = async (req, res) => {
  try {
    const { title, description, videoUrl } = req.body;

    if (!title || !description || !videoUrl) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields (Title, Description, Video URL) are required." 
      });
    }

    const newCourse = new Course({
      title,
      description,
      videoUrl,
      instructor: req.user._id, 
      enrolledCount: 0,
      thumbnail: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1000&auto=format&fit=crop"
    });

    await newCourse.save();
    res.status(201).json({ success: true, message: "Course published!", course: newCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error: Could not publish." });
  }
};

// --- SINGLE EXPORT FOR EVERYTHING ---
module.exports = {
  enrollInCourse,
  completeCourse,
  createCourse
};