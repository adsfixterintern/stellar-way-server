import { Request, Response } from 'express';
import sendResponse from '../../app/utils/sendResponse';
import catchAsync from '../../app/utils/catchAsync';
import { BookingServices } from './booking.service';


const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.body; 

  if (!userId) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'User ID is required in request body',
      data: null,
    });
  }

  const result = await BookingServices.getMyBookingsFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My bookings retrieved successfully',
    data: result,
  });
});



const createBooking = catchAsync(async (req: Request, res: Response) => {

  const result = await BookingServices.createBookingIntoDB(req.body);
  // console.log(result);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Table(s) reserved successfully!',
    data: result,
  });
});


const checkAvailability = catchAsync(async (req: Request, res: Response) => {
  const { date, startTime, endTime } = req.query;

  const result = await BookingServices.getAvailableTablesFromDB(
    date as string,
    startTime as string,
    endTime as string
  );
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.getAllBookingsFromDB(req.query);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result.data,
    meta: result.meta, 
  });
});

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; 
  const result = await BookingServices.getSingleBookingFromDB(id as string);

  if (!result) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'No booking found with this ID',
      data: null,
    });
    return;
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking retrieved successfully',
    data: result,
  });
});

const updateBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BookingServices.updateBookingInDB(id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking updated successfully',
    data: result,
  });
});

const deleteBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await BookingServices.deleteBookingFromDB(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking deleted successfully',
    data: null,
  });
});

export const BookingControllers = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
  getMyBookings,
  checkAvailability,
};