import { NextFunction, RequestHandler } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import jobsService from "./jobs.service";

const createJob: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const validatedData = req.body;
    const { clerkId } = req as AuthenticatedRequest;
    console.log("controller: createJob", clerkId);
    const job = await jobsService.createJob(validatedData, clerkId);

    console.log("controller: createJob", job);

    if (!job) {
      return res.status(400).json({
        success: false,
        message: "Failed to create job",
      });
    }

    return res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

const getJobs: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const { clerkId } = req as AuthenticatedRequest;
    const queryObj = req.query;
    console.log("controller: ", queryObj);
    const jobs = await jobsService.getJobs(clerkId, queryObj);
    
    if (jobs.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No jobs found",
      });
    }

    return res.status(200).json({
      success: true,
      results: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

const getJobById: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const jobId = Array.isArray(req.params.jobId)
      ? req.params.jobId[0]
      : req.params.jobId;
    const { clerkId } = req as AuthenticatedRequest;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const job = await jobsService.getJobById(jobId, clerkId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

const getJobStats: RequestHandler = async(req, res, next: NextFunction) => {
  try{
    const { clerkId } = req as AuthenticatedRequest;
    
    const stats = await jobsService.jobStats(clerkId);

    return res.status(200).json({
      success: true,
      data: stats,
    });

  }catch(error){
    next(error);
  }
};


const jobsController = {
  createJob,
  getJobs,
  getJobById,
  getJobStats
};

export default jobsController;
