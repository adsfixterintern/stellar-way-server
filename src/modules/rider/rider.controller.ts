import { Request, Response } from "express";
import catchAsync from "../../app/utils/catchAsync";
import { RiderServices } from "./rider.service";
import sendResponse from "../../app/utils/sendResponse";
import { Tracking } from "../tracking/tracking.model";
import { Order } from "../order/order.model";


const createRider = catchAsync(async (req: Request, res: Response) => {
  const result = await RiderServices.createRiderIntoDB(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Rider created successfully",
    data: result,
  });
});

const completeDeliveryWithOTP = catchAsync(async (req: Request, res: Response) => {
  const { orderId, otp } = req.body; 

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  // OTP চেক করা
  if (order.deliveryOTP !== otp) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid OTP! Delivery cannot be completed." 
    });
  }

  const result = await Order.findByIdAndUpdate(
    orderId,
    { 
      deliveryStatus: "delivered",
      isOTPVerified: true ,
      paymentStatus: "paid"
    },
    { new: true }
  );

  await Tracking.findOneAndUpdate(
    { orderId },
    { status: "delivered" }
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP Verified! Order Delivered Successfully.",
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
  const result = await RiderServices.getSingleRiderFromDB(
    req.params.id as string,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rider retrieved successfully",
    data: result,
  });
});

const updateRider = catchAsync(async (req: Request, res: Response) => {
  const result = await RiderServices.updateRiderInDB(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rider updated successfully",
    data: result,
  });
});

const deleteRider = catchAsync(async (req: Request, res: Response) => {
  await RiderServices.deleteRiderFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rider deleted successfully",
    data: null,
  });
});

export const RiderControllers = {
  createRider,
  getAllRiders,
  getSingleRider,
  updateRider,
  deleteRider,
  completeDeliveryWithOTP
};
