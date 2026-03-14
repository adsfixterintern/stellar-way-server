import { Request, Response } from 'express';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { TrackingService } from './tracking.service';

const updateLocation = catchAsync(async (req: Request, res: Response) => {
  const result = await TrackingService.updateLiveLocation(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Location updated successfully',
    data: result,
  });
});

const getTrackingDetails = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const result = await TrackingService.getOrderTrackingData(orderId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tracking details fetched successfully',
    data: result,
  });
});

export const TrackingController = {
  updateLocation,
  getTrackingDetails
};