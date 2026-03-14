"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Testimonial = void 0;
const mongoose_1 = require("mongoose");
const testimonialSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    companyLogo: String,
    designation: String,
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
});
exports.Testimonial = (0, mongoose_1.model)('Testimonial', testimonialSchema);
