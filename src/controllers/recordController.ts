import { Request, Response, NextFunction } from 'express';
import FinancialRecord from '../models/FinancialRecord';
import { AuthRequest } from '../middlewares/authMiddleware';
import { Role } from '../models/User';

// Get Records with filtering and pagination
/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get all financial records
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by notes
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Income, Expense]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of records
 */
export const getRecords = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { type, category, startDate, endDate, limit = '50', page = '1', search } = req.query as any;

        const query: any = { isDeleted: false };

        if (type) query.type = type;
        if (category) query.category = category;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate as string);
            if (endDate) query.date.$lte = new Date(endDate as string);
        }

        if (search) {
            query.notes = { $regex: search, $options: 'i' };
        }

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        const records = await FinancialRecord.find(query)
            .populate('userId', 'name email')
            .sort({ date: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await FinancialRecord.countDocuments(query);

        res.json({
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            records,
        });
    } catch (error) {
        next(error);
    }
};

// Get single record
export const getRecordById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const record = await FinancialRecord.findOne({ _id: req.params.id, isDeleted: false }).populate('userId', 'name email');
        if (record) {
            res.json(record);
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        next(error);
    }
};

// Create record
/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a new record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, category, date]
 *             properties:
 *               amount: { type: number }
 *               type: { type: string, enum: [Income, Expense] }
 *               category: { type: string }
 *               date: { type: string, format: date }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Created
 */
export const createRecord = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const record = new FinancialRecord({
            ...req.body,
            userId: req.user!._id, // Set the creator
        });

        const createdRecord = await record.save();
        res.status(201).json(createdRecord);
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/records/{id}:
 *   put:
 *     summary: Update a financial record (Admin Only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount: { type: number }
 *               type: { type: string, enum: [Income, Expense] }
 *               category: { type: string }
 *               date: { type: string, format: date }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
export const updateRecord = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const record = await FinancialRecord.findById(req.params.id);

        if (record) {
            record.amount = req.body.amount || record.amount;
            record.type = req.body.type || record.type;
            record.category = req.body.category || record.category;
            record.date = req.body.date || record.date;
            record.notes = req.body.notes !== undefined ? req.body.notes : record.notes;

            const updatedRecord = await record.save();
            res.json(updatedRecord);
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Soft delete a record (Admin Only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
export const deleteRecord = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const record = await FinancialRecord.findOne({ _id: req.params.id, isDeleted: false });

        if (record) {
            record.isDeleted = true;
            await record.save();
            res.json({ message: 'Record removed (Soft delete)' });
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        next(error);
    }
};
