import express from 'express';
import { getRecords, getRecordById, createRecord, updateRecord, deleteRecord } from '../controllers/recordController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { validate } from '../middlewares/validate';
import { createRecordSchema, updateRecordSchema, getRecordsQuerySchema } from '../validations/recordValidation';
import { Role } from '../models/User';

const router = express.Router();

router.use(protect);

// Admin, Analyst and Viewer can view records
router.route('/')
    .get(authorize(Role.ADMIN, Role.ANALYST, Role.VIEWER), validate(getRecordsQuerySchema), getRecords)
    // Only Admin can create records
    .post(authorize(Role.ADMIN), validate(createRecordSchema), createRecord);

router.route('/:id')
    // Admin, Analyst and Viewer can view a single record details
    .get(authorize(Role.ADMIN, Role.ANALYST, Role.VIEWER), getRecordById)
    // Only Admin can update or delete records
    .put(authorize(Role.ADMIN), validate(updateRecordSchema), updateRecord)
    .delete(authorize(Role.ADMIN), deleteRecord);

export default router;
