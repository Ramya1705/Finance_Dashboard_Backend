import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import User from '../src/models/User';

describe('Auth Endpoints', () => {
    beforeAll(async () => {
        const url = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/finance-dashboard-test';
        await mongoose.connect(url);
    });

    afterAll(async () => {
        await User.deleteMany({ email: 'test@example.com' });
        await mongoose.connection.close();
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'VIEWER'
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should login an existing user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should fail with invalid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });
        
        expect(res.statusCode).toEqual(401);
    });
});
