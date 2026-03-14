import mongoose from 'mongoose';
import config from '.';

const connectDB = async (): Promise<void> => {
  try {
    // কানেকশন অপশনসহ মঙ্গুজ সেটআপ
    const connectionInstance = await mongoose.connect(`${config.mongo_db_url}`);
    
    console.log(`\n ✅ MongoDB Connected! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error: ", error);
    process.exit(1); 
  }
};

export default connectDB;