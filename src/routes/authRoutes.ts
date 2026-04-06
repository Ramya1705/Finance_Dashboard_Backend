import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../validations/userValidation';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { Role } from '../models/User';

const router = express.Router();

router.post('/register', protect, authorize(Role.ADMIN), validate(registerSchema), registerUser); // Only admins can create new users (or we could open it)
// For simplicity in testing without an initial admin, let's allow unauthenticated registration for now.
// In a real app we'd have a seed script or allow public signup. Let's make a separate public register for demo:
router.post('/signup', validate(registerSchema), registerUser);

router.post('/login', validate(loginSchema), loginUser);

export default router;
