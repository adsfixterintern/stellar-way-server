import { Request, Response } from "express";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { ChefServices } from "./chef.service";

const createChef = catchAsync(async (req: Request, res: Response) => {
  const result = await ChefServices.createChefIntoDB(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Chef created successfully",
    data: result,
  });
});

const getAllChefs = catchAsync(async (req: Request, res: Response) => {
  const result = await ChefServices.getAllChefsFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Chefs retrieved successfully",
    data: result,
  });
});

const getSingleChef = catchAsync(async (req: Request, res: Response) => {
  const result = await ChefServices.getSingleChefFromDB(
    req.params.id as string,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Chef retrieved successfully",
    data: result,
  });
});

const updateChef = catchAsync(async (req: Request, res: Response) => {
  const result = await ChefServices.updateChefInDB(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Chef updated successfully",
    data: result,
  });
});

const deleteChef = catchAsync(async (req: Request, res: Response) => {
  await ChefServices.deleteChefFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Chef deleted successfully",
    data: null,
  });
});

export const ChefControllers = {
  createChef,
  getAllChefs,
  getSingleChef,
  updateChef,
  deleteChef,
};
