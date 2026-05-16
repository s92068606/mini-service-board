const Job = require("../models/Job");

const validateCreatePayload = (payload) => {
  const requiredFields = ["title", "description", "location"];
  const missing = requiredFields.filter((field) => !payload[field]);
  if (missing.length) {
    const message = `Missing required field${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`;
    const err = new Error(message);
    err.status = 400;
    throw err;
  }
};

// CREATE JOB
const createJob = async (req, res, next) => {
  try {
    validateCreatePayload(req.body);
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

// GET ALL JOBS (with optional category/status/search filters)
const getJobs = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE JOB
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

// UPDATE JOB (status only)
const updateJob = async (req, res, next) => {
  try {
    const updateData = {};
    if (req.body.status) updateData.status = req.body.status;

    if (Object.keys(updateData).length === 0) {
      const err = new Error("Only status updates are allowed");
      err.status = 400;
      throw err;
    }

    const job = await Job.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

// DELETE JOB
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
};
