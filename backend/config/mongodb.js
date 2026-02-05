

import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);

        console.log("✅ Database Connected Successfully");
    } catch (error) {
        console.error("❌ Database Connection Error:", error.message);
        process.exit(1); 
    }
};

export default connectDB;

