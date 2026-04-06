# Finance Dashboard Backend

## Overview
A robust Node.js, Express, and MongoDB backend for managing financial records with Role-Based Access Control (RBAC).

## Tech Stack
- Runtime: Node.js
- Language: TypeScript
- Framework: Express.js
- Database: MongoDB (Mongoose)
- Validation: Zod
- Security: JWT, Bcryptjs, Rate Limiting (express-rate-limit)
- Documentation: Swagger (OpenAPI 3.0)
- Testing: Jest, Supertest

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment:
   Create a .env file at the root:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/finance-dashboard
   JWT_SECRET=supersecret123
   NODE_ENV=development
   ```

3. Seed Database (Optional):
   Populate your database with sample Admin, Analyst, and Viewer accounts + 20 mock records:
   ```bash
   npm run seed
   ```

4. Run Server:
   ```bash
   npm run dev
   ```

5. Run Tests:
   ```bash
   npm test
   ```

## Roles & Permissions

- VIEWER: Can read dashboard summaries and view own profile.
- ANALYST: Can read all financial records and access depth insights/summaries.
- ADMIN: Full management access (CRUD for both users and financial records).

## API Endpoints

### Auth
- POST /api/auth/signup: Register a new user.
- POST /api/auth/login: Authenticate and receive a JWT.

### Users (Admin Only)
- GET /api/users: List all users.
- GET /api/users/:id: Get specific user.
- PUT /api/users/:id: Update user role/status.
- DELETE /api/users/:id: Remove user.

### Financial Records
- GET /api/records: List records with filters (type, category, startDate, endDate) and pagination.
- POST /api/records: Create a new record (Admin Only).
- PUT /api/records/:id: Update a record (Admin Only).
- DELETE /api/records/:id: Delete a record (Admin Only).

### Dashboard Summary
- GET /api/summary: Returns:
  - Total Income & Expense
  - Net Balance
  - Category-wise Expense Breakdown
  - Recent Activities
  - Monthly Trends data.

### Features (New)
- Soft Delete: Deleting users or records marks them as `isDeleted: true` instead of permanent removal.
- Text Search: Use `?search=term` on User and Record list APIs.
- Rate Limiting: Protected against brute-force (Auth: 10 req/15min, API: 100 req/15min).
- API Documentation: Detailed interactive docs available at `/api-docs`.
