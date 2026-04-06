import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/errorHandler';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import recordRoutes from './routes/recordRoutes';
import summaryRoutes from './routes/summaryRoutes';
import { apiLimiter, authLimiter } from './middlewares/rateLimiter';
import { setupSwagger } from './config/swagger';

dotenv.config();

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Documentation
setupSwagger(app);

// Main Routes
app.use('/api', apiLimiter); // Apply global rate limiting to all /api routes
app.use('/api/auth', authLimiter, authRoutes); // Apply stricter rate limiting to auth routes
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/summary', summaryRoutes);

app.get('/api/health', (req: Request, res: Response) => {
    const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
    res.json({
        status: 'OK',
        database: states[mongoose.connection.readyState],
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req: Request, res: Response) => {
    res.send('Finance Dashboard API is running...');
});

// Error handling middleware (should be after routes)
app.use(errorHandler);

export default app;
