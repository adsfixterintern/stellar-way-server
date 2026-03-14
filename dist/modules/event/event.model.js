"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    featured: { type: Boolean, default: false },
    status: { type: String, default: 'active' },
    price: { type: Number, required: true }
});
exports.Event = (0, mongoose_1.model)('Event', eventSchema);
