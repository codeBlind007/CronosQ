import {AppError} from "../../utils/AppError";
import {getAuth} from '@clerk/express'
import { NextFunction, RequestHandler } from "express";


const getUserProfile: RequestHandler = async (req, res, next: NextFunction) => {
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