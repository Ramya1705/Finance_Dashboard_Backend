import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

// Get all users
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { search } = req.query;
        const query: any = { isDeleted: false };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const users = await User.find(query).select('-password');
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await User.findOne({ _id: req.params.id, isDeleted: false }).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

// Update user
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.role = req.body.role || user.role;
            user.status = req.body.status || user.status;

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

// Delete user
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await User.findOne({ _id: req.params.id, isDeleted: false });

        if (user) {
            user.isDeleted = true;
            await user.save();
            res.json({ message: 'User removed (Soft delete)' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};
