import { z } from 'zod';
import { RecordType } from '../models/FinancialRecord';

export const createRecordSchema = z.object({
    body: z.object({
        amount: z.number().positive('Amount must be positive'),
        type: z.nativeEnum(RecordType),
        category: z.string().min(1, 'Category is required'),
        date: z.string().or(z.date()).transform((val) => new Date(val)),
        notes: z.string().optional(),
    }),
});

export const updateRecordSchema = z.object({
    body: z.object({
        amount: z.number().positive().optional(),
        type: z.nativeEnum(RecordType).optional(),
        category: z.string().optional(),
        date: z.string().or(z.date()).transform((val) => new Date(val)).optional(),
        notes: z.string().optional(),
    }),
});

export const getRecordsQuerySchema = z.object({
    query: z.object({
        type: z.nativeEnum(RecordType).optional(),
        category: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        limit: z.string().optional(),
        page: z.string().optional(),
    }),
});
