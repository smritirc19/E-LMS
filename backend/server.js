const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// 1. Import Models
const Course = require("./models/Course");
const User = require("./models/User");

const app = express();

// 2. Middlewares
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5174", 
  credentials: true
}));

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("DB Connection Error ❌:", err));

// --- COURSE ROUTES ---

// Get ALL courses
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching courses", error: err.message });
  }
});

// Get SINGLE course by custom ID (e.g., "2")
// This replaces the 3 duplicate routes you had!
app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findOne({ id: req.params.id }); 
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// --- USER & ENROLLMENT ROUTES ---

app.get("/api/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("enrolledCourses.courseId");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/enroll", async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // 1. Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Prevent duplicate enrollment
    const alreadyEnrolled = user.enrolledCourses.find(c => c.courseId.toString() === courseId);
    if (alreadyEnrolled) {
      return res.status(400).json({ message: "You are already enrolled!" });
    }

    // 3. Push the new course
    user.enrolledCourses.push({ 
      courseId, 
      progress: 0, 
      lastAccessed: new Date() 
    });

    // 4. Save the changes
    await user.save();

    // 5. FETCH AGAIN WITH POPULATE 🪄
    // This is the critical step to get the 'title' and 'imageUrl' 
    // for the course you just added.
    const updatedUser = await User.findById(userId).populate("enrolledCourses.courseId");

    res.status(200).json({ 
      message: "Enrolled successfully! 🎓", 
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        enrolledCourses: updatedUser.enrolledCourses // Now contains full course objects
      } 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// --- AUTH ROUTES ---

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) return res.status(400).json({ message: "User already exists!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email: cleanEmail, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully! ✅" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    // 1. Find user AND populate the course details
    const user = await User.findOne({ email: cleanEmail })
      .populate("enrolledCourses.courseId"); // 👈 This is the magic line!
    
    if (!user) return res.status(400).json({ message: "Email not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

    // 2. Send back the populated user object
    res.status(200).json({
      message: "Login successful ✅",
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        enrolledCourses: user.enrolledCourses // Now includes titles, images, etc.
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
app.get("/api/user/:id", async (req, res) => {
  try {
    // .populate('enrolledCourses.courseId') is the magic wand 🪄
    // It swaps the ID for the full Course Object (Title, Image, etc.)
    const user = await User.findById(req.params.id).populate("enrolledCourses.courseId");
    
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SEED ROUTE (Keep for testing) ---
app.get("/api/seed-courses", async (req, res) => {
  try {
    await Course.deleteMany({});
    const sampleCourses = [
      { id: "1", title: "Full-Stack MERN", instructor: "Smriti R.", price: 49.99, category: "Development" },
      { id: "2", title: "Python for Data Science", instructor: "Dr. Michael Smith", price: 39.99, category: "Data Science" }
    ];
    await Course.insertMany(sampleCourses);
    res.status(200).send("<h1>Success! ✅</h1>");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));