import { Request, Response } from 'express';
import { Notification } from './notification.model';
import { User } from '../user/user.model';
import { io } from '../../app/utils/socket';
import { Types } from 'mongoose';


export const getUserNotificationsByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }

    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User does not exist' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;


    const userId = user._id as Types.ObjectId;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ userId });

    res.status(200).json({
      success: true,
      meta: { 
        page, 
        limit, 
        total, 
        totalPage: Math.ceil(total / limit) 
      },
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Fetch error', error });
  }
};


export const createNotification = async (req: Request, res: Response) => {
  try {
    const { title, message, type, email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userId = user._id as Types.ObjectId;

    const result = await Notification.create({ 
      title, 
      message, 
      type, 
      userId
    });


    if (io) {
      io.to(userId.toString()).emit('new-notification', {
        _id: result._id,
        title: result.title,
        message: result.message,
        type: result.type,
        createdAt: result.createdAt
      });
    }

    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Create error', error: error.message });
  }
};

// ৩. নোটিফিকেশন Read হিসেবে মার্ক করা
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await Notification.findByIdAndUpdate(
      id,
      { status: 'read' },
      { new: true }
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Update error', error });
  }
};


export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Delete error', error });
  }
};

export const clearAllNotificationsByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userId = user._id as Types.ObjectId;

    await Notification.deleteMany({ userId });

    res.status(200).json({ 
      success: true, 
      message: 'All notifications cleared successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to clear notifications', 
      error 
    });
  }
};