import { Request, Response } from "express";
import catchAsync from "../../app/utils/catchAsync";
import { RiderServices } from "./rider.service";
import sendResponse from "../../app/utils/sendResponse";


const createRider = catchAsync(async (req: Request, res: Response) => {
  const result = await RiderServices.createRiderIntoDB(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Rider created successfully",
    data: result,
  });
});

const getAllRiders = catchAsync(async (req: Request, res: Response) => {
  const result = await RiderServices.getAllRidersFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Riders retrieved successfully",
    data: result,
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
};
