import { NextFunction, RequestHandler } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import jobsService from "./jobs.service";

const createJob: RequestHandler = async (req, res, next: NextFunction) => {
    try{
        const validatedData = req.body;
        const { userId } = req as AuthenticatedRequest;
        console.log("controller: createJob");
        const job = await jobsService.createJob(validatedData, userId);
        
        if(!job){
            return res.status(400).json({
                success: false,
                message: 'Failed to create job'
            });
        }

        return res.status(201).json({
            success: true,
            data: job
        });

    }catch(error){
        next(error);
    }
}

const jobsController = {
    createJob
}

export default jobsController;