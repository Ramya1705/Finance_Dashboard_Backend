import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import User from '../src/models/User';
import FinancialRecord from '../src/models/FinancialRecord';

describe('Financial Record Endpoints', () => {
    let token: string;
    let recordId: string;

    beforeAll(async () => {
        const url = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/finance-dashboard-test';
        await mongoose.connect(url);
        
        // Remove existing test data
        await User.deleteMany({ email: 'admin_test@example.com' });

        // Register Admin
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Admin User',
                email: 'admin_test@example.com',
                password: 'password123',
                role: 'ADMIN'
            });
        
        token = res.body.token;
    });

    afterAll(async () => {
        await User.deleteMany({ email: 'admin_test@example.com' });
        await FinancialRecord.deleteMany({ notes: 'Test record' });
        await mongoose.connection.close();
    });

    it('should create a new financial record (Admin)', async () => {
        const res = await request(app)
            .post('/api/records')
            .set('Authorization', `Bearer ${token}`)
            .send({
                amount: 1000,
                type: 'INCOME',
                category: 'Salary',
                date: new Date(),
                notes: 'Test record'
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        recordId = res.body._id;
    });

    it('should get all financial records', async () => {
        const res = await request(app)
            .get('/api/records')
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.records)).toBe(true);
    });

    it('should search for records by notes', async () => {
        const res = await request(app)
            .get('/api/records?search=Test')
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.records.length).toBeGreaterThan(0);
        expect(res.body.records[0].notes).toMatch(/Test/i);
    });

    it('should soft delete a record', async () => {
        const res = await request(app)
            .delete(`/api/records/${recordId}`)
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toMatch(/Soft delete/i);

        // Verify it no longer appears in listings
        const getRes = await request(app)
            .get('/api/records')
            .set('Authorization', `Bearer ${token}`);
        
        const deletedRecord = getRes.body.records.find((r: any) => r._id === recordId);
        expect(deletedRecord).toBeUndefined();
    });
});
