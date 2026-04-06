import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { validate } from '../middlewares/validate';
import { updateUserSchema } from '../validations/userValidation';
import { Role } from '../models/User';

const router = express.Router();

// Only ADMINs can manage users
router.use(protect);
router.use(authorize(Role.ADMIN));

router.route('/')
    .get(getUsers);

router.route('/:id')
    .get(getUserById)
    .put(validate(updateUserSchema), updateUser)
    .delete(deleteUser);

export default router;
