import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User, { Role, Status } from '../models/User';
import FinancialRecord, { RecordType } from '../models/FinancialRecord';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/finance-dashboard';

const seedData = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await FinancialRecord.deleteMany({});

        // Create Users
        console.log('Creating users...');
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password,
            role: Role.ADMIN,
            status: Status.ACTIVE,
        });

        const analyst = await User.create({
            name: 'Analyst User',
            email: 'analyst@example.com',
            password,
            role: Role.ANALYST,
            status: Status.ACTIVE,
        });

        const viewer = await User.create({
            name: 'Viewer User',
            email: 'viewer@example.com',
            password,
            role: Role.VIEWER,
            status: Status.ACTIVE,
        });

        console.log('Users created!');

        // Create Financial Records
        console.log('Creating financial records...');
        const categories = ['Salary', 'Freelance', 'Food', 'Rent', 'Utilities', 'Entertainment', 'Transport'];
        const records = [];

        // Logic to generate some varied data for trends
        for (let i = 0; i < 20; i++) {
            const isIncome = Math.random() > 0.6;
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 60)); // Random date in last 60 days

            records.push({
                amount: isIncome ? (Math.floor(Math.random() * 5000) + 1000) : (Math.floor(Math.random() * 500) + 20),
                type: isIncome ? RecordType.INCOME : RecordType.EXPENSE,
                category: categories[Math.floor(Math.random() * categories.length)],
                date,
                notes: `Sample ${isIncome ? 'income' : 'expense'} record ${i + 1}`,
                userId: admin._id,
            });
        }

        await FinancialRecord.insertMany(records);
        console.log('Financial records created!');

        console.log('Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
