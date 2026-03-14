"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = void 0;
const mongoose_1 = require("mongoose");
const menuSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: {
        url: { type: String, required: true },
        publicId: { type: String, required: true }
    },
    stock: { type: Number, default: 0 },
    chefId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Chef' },
    categoryId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category' },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    reviews: [{
            rating: Number,
            comment: String,
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
        }]
}, { timestamps: true });
exports.Menu = (0, mongoose_1.model)('Menu', menuSchema);
