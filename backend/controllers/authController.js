const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("./models/User");

// Register
router.post("/register", async (req, res) => {
    // 1. Add 'role' to the destructuring here
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. Include 'role' when creating the new user
        // If role isn't sent, it will use the default from your Model ('student')
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'student' 
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: { 
                id: newUser._id, 
                name: newUser.name, 
                email: newUser.email,
                role: newUser.role // 3. Send the role back to the frontend
            },
        });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;