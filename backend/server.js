const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// 1. Import Models
const Course = require("./models/Course");
const User = require("./models/User");
const Order = require("./models/Orders"); // <--- ADDED THIS IMPORT

const app = express();

// 2. Middlewares
app.use(express.json()); 
app.use(cors({
  origin: "http://localhost:5174", 
  credentials: true
}));

// Route Middlewares
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("DB Connection Error ❌:", err));

// --- AUTH ROUTES ---
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body; 
    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) return res.status(400).json({ message: "User already exists!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ 
      name, 
      email: cleanEmail, 
      password: hashedPassword,
      role: role || 'student' 
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully! ✅", role: newUser.role });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail }).populate("enrolledCourses.courseId");
    
    if (!user) return res.status(400).json({ message: "Email not found!" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

    res.status(200).json({
      message: "Login successful ✅",
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        enrolledCourses: user.enrolledCourses 
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// --- COURSE ROUTES ---
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching courses", error: err.message });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findOne({ id: req.params.id }); 
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// --- USER PROFILE ROUTE ---
app.get("/api/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("enrolledCourses.courseId");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- MERGED ENROLLMENT & PAYMENT ROUTE ---
app.post("/api/enroll", async (req, res) => {
  const { userId, courseId, mongoId, isPaid } = req.body;

  try {
    // 1. Check if User exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Enroll the user (using $addToSet to avoid duplicates)
    // We store the MongoDB ObjectId in the user's array
    await User.findByIdAndUpdate(userId, {
      $addToSet: { 
        enrolledCourses: { 
          courseId: mongoId, 
          progress: 0, 
          lastAccessed: new Date() 
        } 
      }
    });

    // 3. If it's a paid course, create the Order entry
    if (isPaid) {
      const newOrder = new Order({
        userId,
        courseId, // This is the simple ID "3", "6", etc.
        mongoCourseId: mongoId,
        status: 'completed'
      });
      await newOrder.save();
    }

    // 4. Send response so frontend can navigate
    res.status(200).json({ 
      success: true, 
      message: "Enrollment successful and order recorded" 
    });

  } catch (err) {
    console.error("Enrollment error:", err);
    res.status(500).json({ message: "Server error during enrollment", error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));