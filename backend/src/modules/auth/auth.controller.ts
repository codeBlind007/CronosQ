import {AppError} from "../../utils/AppError";
import {getAuth} from '@clerk/express'
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { NextFunction, Response } from "express";


const getUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const auth = getAuth(req);

  return res.json({
    success: true,
    data: {
      userId: auth.userId,
      sessionId: auth.sessionId,
    }
  });
};


const authController = {
  getUserProfile,
};

export default authController;