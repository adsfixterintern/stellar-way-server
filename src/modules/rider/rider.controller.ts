
import { Request, Response } from "express";
import catchAsync from "../../app/utils/catchAsync"; 
import { RiderServices } from "./rider.service";
import sendResponse from "../../app/utils/sendResponse";
import { Tracking } from "../tracking/tracking.model";
import { Order } from "../order/order.model";


const applyRider = catchAsync(async (req: Request, res: Response) => {


  const userId = (req as any).user?.id;

  if (!userId) {
    throw new Error("User authentication failed! Token might be missing.");
  }


  const result = await RiderServices.applyForRiderIntoDB({
    ...req.body,
    userId,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Rider application submitted successfully! Waiting for admin approval.",
    data: result,
  });
});


const approveRider = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await RiderServices.approveRiderInDB(id as any);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rider approved and role updated to 'rider'.",
    data: result,
  });
});


const getAllRiders = catchAsync(async (req: Request, res: Response) => {
  const result = await RiderServices.getAllRidersFromDB(req.query);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Riders retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});


const getSingleRider = catchAsync(async (req: Request, res: Response) => {
  const result = await RiderServices.getSingleRiderFromDB(req.params.id as any);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rider details retrieved successfully",
    data: result,
  });
});


const updateRider = catchAsync(async (req: Request, res: Response) => {
  const result = await RiderServices.updateRiderInDB(req.params.id as any, req.body);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rider updated successfully",
    data: result,
  });
});


const deleteRider = catchAsync(async (req: Request, res: Response) => {
  await RiderServices.deleteRiderFromDB(req.params.id as any);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rider deleted successfully",
    data: null,
  });
});

export const RiderControllers = {
  applyRider,
  approveRider,
  getAllRiders,
  getSingleRider,
  updateRider,
  deleteRider,
};
