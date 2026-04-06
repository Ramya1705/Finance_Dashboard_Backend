import express from 'express';
import { getDashboardSummary } from '../controllers/summaryController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { Role } from '../models/User';

const router = express.Router();

router.use(protect);
// Viewer, Analyst, and Admin can access the summary dashboard
router.get('/', authorize(Role.VIEWER, Role.ANALYST, Role.ADMIN), getDashboardSummary);

export default router;
