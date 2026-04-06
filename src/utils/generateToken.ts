import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export const generateToken = (id: Types.ObjectId | string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};
