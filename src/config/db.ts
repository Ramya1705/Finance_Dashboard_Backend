import mongoose from 'mongoose';

export const dbStatus = {
    lastError: null as string | null
};

export const connectDB = async () => {
    try {
        dbStatus.lastError = null;
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/finance-dashboard';
        await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        if (error instanceof Error) {
            dbStatus.lastError = error.message;
            console.error(`Error: ${error.message}`);
        } else {
            dbStatus.lastError = 'Unknown database error occurred';
            console.error(`Unknown database error occurred`);
        }
        // process.exit(1); 
    }
};
