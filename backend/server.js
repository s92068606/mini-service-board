const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

/* ✅ 1. CORS FIRST (VERY IMPORTANT) */
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ✅ 2. JSON PARSER */
app.use(express.json());

/* ✅ 3. ROUTES AFTER CORS */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));

// 🔥 TEST ENDPOINT - Create a test user for easy testing
app.post("/api/auth/seed", async (req, res) => {
  try {
    const User = require("./models/User");
    const bcrypt = require("bcryptjs");

    const testUser = {
      name: "Test User",
      email: "test@example.com",
      password: await bcrypt.hash("password123", 10),
    };

    // Check if user already exists
    const existing = await User.findOne({ email: testUser.email });
    if (existing) {
      return res.json({
        message: "Test user already exists",
        email: testUser.email,
        password: "password123",
      });
    }

    const user = new User(testUser);
    await user.save();

    res.status(201).json({
      message: "Test user created",
      email: testUser.email,
      password: "password123",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating test user", error: err.message });
  }
});

// 404 for missing API routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
const errorHandler = require("./middleware/errorMiddleware");
app.use(errorHandler);

connectDB();

/* ✅ SERVER START */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});