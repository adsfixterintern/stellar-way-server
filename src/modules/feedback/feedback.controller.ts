import httpStatus from 'http-status';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { FeedbackServices } from './feedback.service';

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
export const FeedbackControllers = {
  createFeedback,
  getAllFeedbacks,
};