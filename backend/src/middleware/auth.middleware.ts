import {getAuth} from '@clerk/express'
import {Request, Response, NextFunction} from 'express';
import {AppError} from '../utils/AppError';

export interface AuthenticatedRequest extends Request {
    userId? : string;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const {userId} = getAuth(req);

    if(!userId) {
        throw new AppError('Unauthorized', 401);
    }

    req.userId = userId;

    next();
}