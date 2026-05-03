const express = require('express');
const router = express.Router();
const { enrollInCourse, completeCourse, createCourse } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

// Student Routes
router.post('/enroll', protect, enrollInCourse);
router.patch('/complete/:courseId', protect, completeCourse);

// Instructor Route 
// NOTE: If your server.js uses app.use('/api/enrollments', enrollmentRoutes)
// then this endpoint will be POST http://localhost:5000/api/enrollments/create
router.post('/create', protect, createCourse); 

module.exports = router;