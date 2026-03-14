"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gallery = void 0;
const mongoose_1 = require("mongoose");
const gallerySchema = new mongoose_1.Schema({
    image: { type: String, required: true },
    categoryId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category' },
    sortOrder: { type: Number, default: 0 }
});
exports.Gallery = (0, mongoose_1.model)('Gallery', gallerySchema);
