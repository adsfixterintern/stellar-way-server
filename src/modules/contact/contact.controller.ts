import { Request, Response } from "express";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { ContactService } from "./contact.service";

const createContactMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.createMessageIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Message sent successfully! We will get back to you soon.",
    data: result,
  });
});

const getAllMessages = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.getAllMessagesFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Messages retrieved successfully!",
    data: result,
  });
});

const deleteMessage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await ContactService.deleteMessageFromDB(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Message deleted successfully!",
    data: null,
  });
});

export const ContactController = {
  createContactMessage,
  getAllMessages,
  deleteMessage,
};
