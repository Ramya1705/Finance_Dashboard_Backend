import { Request, Response, NextFunction } from 'express';
import FinancialRecord, { RecordType } from '../models/FinancialRecord';
import { AuthRequest } from '../middlewares/authMiddleware';

/**
 * @swagger
 * /api/summary:
 *   get:
 *     summary: Get dashboard summary analytics
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary data
 */
export const getDashboardSummary = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { startDate, endDate } = req.query as any;

        const matchStage: any = {};
        if (startDate || endDate) {
            matchStage.date = {};
            if (startDate) matchStage.date.$gte = new Date(startDate as string);
            if (endDate) matchStage.date.$lte = new Date(endDate as string);
        }

        const aggregation = await FinancialRecord.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$type',
                    totalAmount: { $sum: '$amount' },
                },
            },
        ]);

        let totalIncome = 0;
        let totalExpense = 0;

        aggregation.forEach((item) => {
            if (item._id === RecordType.INCOME) totalIncome = item.totalAmount;
            if (item._id === RecordType.EXPENSE) totalExpense = item.totalAmount;
        });

        const netBalance = totalIncome - totalExpense;

        // Get category-wise breakdown for Expenses
        const categoryBreakdown = await FinancialRecord.aggregate([
            { $match: { ...matchStage, type: RecordType.EXPENSE } },
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' },
                },
            },
            { $sort: { totalAmount: -1 } },
        ]);

        // Recent 5 activities
        const recentActivity = await FinancialRecord.find(matchStage)
            .sort({ date: -1 })
            .limit(5)
            .populate('userId', 'name email');

        // Get monthly trends for the last 6 months (or whatever range is filtered)
        const trends = await FinancialRecord.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' },
                        type: '$type',
                    },
                    totalAmount: { $sum: '$amount' },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            {
                $group: {
                    _id: { year: '$_id.year', month: '$_id.month' },
                    income: {
                        $sum: {
                            $cond: [{ $eq: ['$_id.type', RecordType.INCOME] }, '$totalAmount', 0],
                        },
                    },
                    expense: {
                        $sum: {
                            $cond: [{ $eq: ['$_id.type', RecordType.EXPENSE] }, '$totalAmount', 0],
                        },
                    },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        res.json({
            totalIncome,
            totalExpense,
            netBalance,
            categoryBreakdown,
            trends,
            recentActivity,
        });
    } catch (error) {
        next(error);
    }
};
