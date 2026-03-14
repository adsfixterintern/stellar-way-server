"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = __importDefault(require("."));
const connectDB = async () => {
    try {
        // কানেকশন অপশনসহ মঙ্গুজ সেটআপ
        const connectionInstance = await mongoose_1.default.connect(`${_1.default.mongo_db_url}`);
        console.log(`\n ✅ MongoDB Connected! DB HOST: ${connectionInstance.connection.host}`);
    }
    catch (error) {
        console.error("❌ MongoDB connection error: ", error);
        process.exit(1);
    }
};
exports.default = connectDB;
