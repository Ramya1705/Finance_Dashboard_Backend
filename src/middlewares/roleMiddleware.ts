import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { Role } from '../models/User';

export const authorize = (...roles: Role[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({ message: `Role (${req.user.role}) is not allowed to access this resource` });
            return;
        }
        next();
    };
};
