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

const getNotifications: RequestHandler = async (req, res, next: NextFunction) => {
  try {
      const { clerkId } = req as AuthenticatedRequest;
      console.log("controller: getNotifications", clerkId);
      
    const notifications = await jobsService.getNotifications(clerkId);

    if (notifications.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No notifications found",
      });
    }

    return res.status(200).json({
      success: true,
      results: notifications.length,
      data: notifications,
    });

  }catch (error) {
    next(error);
  }
}

const getNotificationById: RequestHandler = async (req, res, next: NextFunction) => {
  try{
    const {clerkId} = req as AuthenticatedRequest;
    const notificationId = Array.isArray(req.params.notificationId)
      ? req.params.notificationId[0]
      : req.params.notificationId;

    if(!notificationId){
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      });
    }

    const notification = await jobsService.getNotificationById(notificationId, clerkId);

    if(!notification){
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: notification,
    })

  }catch(error) {
    next(error);
  }
}

const jobsController = {
  createJob,
  getJobs,
  getJobById,
  getNotifications,
  getNotificationById
};

export default jobsController;
