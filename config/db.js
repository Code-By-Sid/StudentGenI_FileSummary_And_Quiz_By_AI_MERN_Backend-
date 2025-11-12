import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB);
        console.log(`MongoDB Connected...`);
    } 
    catch (error) {
        console.error(`Error: ${error.message}`);
    }       
}
export default connectDB;