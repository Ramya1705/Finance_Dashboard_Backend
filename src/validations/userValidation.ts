import { z } from 'zod';
import { Role, Status } from '../models/User';

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        role: z.nativeEnum(Role).optional(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
    }),
});

export const updateUserSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        role: z.nativeEnum(Role).optional(),
        status: z.nativeEnum(Status).optional(),
    }),
});
