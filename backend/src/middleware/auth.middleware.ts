import {getAuth} from '@clerk/express';
import {Request, Response, NextFunction, RequestHandler} from 'express';
import {AppError} from '../utils/AppError';

export interface AuthenticatedRequest extends Request {
    clerkId : string;
}

export const authMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    try{
        const {userId} = getAuth(req);
        console.log(userId);
        if(!userId) {
            throw new AppError('Unauthorized', 401);
        }

        (req as AuthenticatedRequest).clerkId = userId;

        next();
    }catch(error){
        console.error(error);
        next(error);
    }
}