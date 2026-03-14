"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chef = void 0;
const mongoose_1 = require("mongoose");
const chefSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    image: String,
    designation: String,
    rating: { type: Number, default: 5 },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' }
});
exports.Chef = (0, mongoose_1.model)('Chef', chefSchema);
