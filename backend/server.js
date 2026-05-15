const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const jobRoutes = require("./routes/jobRoutes");
const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.use("/api/jobs", jobRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);