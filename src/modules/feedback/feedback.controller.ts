import httpStatus from 'http-status';
import { Request } from 'express';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { FeedbackServices } from './feedback.service';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// create feedback api 
const createFeedback = catchAsync(async (req, res) => {
  const result = await FeedbackServices.createFeedbackIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Feedback submitted successfully',
    data: result,
  });
});

// get app feedback api 
const getAllFeedbacks = catchAsync(async (req, res) => {
  const result = await FeedbackServices.getAllFeedbacksFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedbacks fetched successfully',
    data: result.result,
  });
});

const updateFeedback = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FeedbackServices.updateFeedbackStatusIntoDB(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback updated successfully',
    data: result,
  });
});

const getMyFeedbacks = catchAsync(async (req, res) => {
  const userId = (req.user as any)._id; 
  const result = await FeedbackServices.getMyFeedbacksFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your feedbacks fetched successfully',
    data: result,
  });
});

const deleteFeedback = catchAsync(async (req, res) => {
  const { id } = req.params;
  await FeedbackServices.deleteFeedbackFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback deleted successfully',
    data: null,
  });
});


export const FeedbackControllers = {
  createFeedback,
  getAllFeedbacks,
  updateFeedback,
  getMyFeedbacks,
  deleteFeedback
};