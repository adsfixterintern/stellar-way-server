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

export const OfferController = {
  createOffer,
  getActiveOffers,
  deleteOffer
};
