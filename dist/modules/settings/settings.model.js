"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const mongoose_1 = require("mongoose");
const settingsSchema = new mongoose_1.Schema({
    siteName: { type: String, default: 'My Restaurant' },
    maintenanceMode: { type: Boolean, default: false },
    deliveryCharge: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    language: { type: String, enum: ['English', 'Bangla'], default: 'English' }
});
exports.Settings = (0, mongoose_1.model)('Settings', settingsSchema);
