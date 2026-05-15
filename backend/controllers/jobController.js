const Job = require("../models/Job");

// CREATE JOB
const createJob = async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

// GET ALL JOBS
const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
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

// UPDATE JOB
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
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