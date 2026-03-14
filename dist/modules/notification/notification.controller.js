"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.markAsRead = exports.createNotification = exports.getUserNotificationsByEmail = void 0;
const notification_model_1 = require("./notification.model");
const user_model_1 = require("../user/user.model");
const getUserNotificationsByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            return res.status(400).json({ success: false, message: 'need email' });
        }
        const user = await user_model_1.User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'user doesnot exist' });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const notifications = await notification_model_1.Notification.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await notification_model_1.Notification.countDocuments({ userId: user._id });
        res.status(200).json({
            success: true,
            meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
            data: notifications,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Fetch error', error });
    }
};
exports.getUserNotificationsByEmail = getUserNotificationsByEmail;
const createNotification = async (req, res) => {
    try {
        const { title, message, type, userId } = req.body;
        const result = await notification_model_1.Notification.create({ title, message, type, userId });
        res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: 'Create error', error });
    }
};
exports.createNotification = createNotification;
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await notification_model_1.Notification.findByIdAndUpdate(id, { status: 'read' }, { new: true });
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: 'Update error', error });
    }
};
exports.markAsRead = markAsRead;
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        await notification_model_1.Notification.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ success: false, message: 'Delete error', error });
    }
};
exports.deleteNotification = deleteNotification;
