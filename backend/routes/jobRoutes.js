const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

// CREATE - public
router.post("/", createJob);

// READ - protected: only logged-in users can view requests
router.get("/", protect, getJobs);
router.get("/:id", protect, getJobById);

// UPDATE (status only) - protected
router.patch("/:id", protect, updateJob);

// DELETE - protected
router.delete("/:id", protect, deleteJob);

module.exports = router;