import { Request, Response } from "express";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { OfferService } from "./offer.service";

const createOffer = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferService.createOfferIntoDB(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Offer created successfully!",
    data: result,
  });
});

const allOffers = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferService.getAllOffersFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All offers retrieved!",
    data: result,
  });
});

const getActiveOffers = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferService.getActiveOffersFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Active offers retrieved!",
    data: result,
  });
});

const deleteOffer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await OfferService.deleteOfferFromDB(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Offer deleted successfully!",
    data: null,
  });
});

const updateOffer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferService.updateOfferIntoDB(id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Offer updated successfully!",
    data: result,
  });
});

export const OfferController = {
  createOffer,
  getActiveOffers,
  deleteOffer,
  updateOffer,
  allOffers,
};
