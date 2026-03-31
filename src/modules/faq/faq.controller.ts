import httpStatus from 'http-status';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { FaqServices } from './faq.service';

// creat faq api
const createFaq = catchAsync(async (req, res) => {
  const result = await FaqServices.createFaqIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'FAQ created successfully',
    data: result,
  });
});

// gel all faq api
const getAllFaqs = catchAsync(async (req, res) => {
  const result = await FaqServices.getAllFaqsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'FAQs fetched successfully',
    data: result.result,
  });
});

// get single faq api 
const getSingleFaq = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FaqServices.getSingleFaqFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'FAQ fetched successfully',
    data: result,
  });
});

// update faq api 
const updateFaq = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FaqServices.updateFaqIntoDB(id as string, req.body);

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'FAQ not found to update!',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'FAQ updated successfully',
    data: result,
  });
});

// delete faq api 
const deleteFaq = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FaqServices.deleteFaqFromDB(id as string);

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'FAQ not found to delete!',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'FAQ deleted successfully',
    data: result,
  });
});
export const FaqControllers = {
  createFaq,
  getAllFaqs,
  getSingleFaq,
  updateFaq,
  deleteFaq
};