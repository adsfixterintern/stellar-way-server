import { Request, Response } from 'express';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { MessageService } from './message.service';

const createMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await MessageService.sendMessageIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

const getAllMessages = catchAsync(async (req: Request, res: Response) => {
  const result = await MessageService.getAllMessagesFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Messages fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const deleteMessage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await MessageService.deleteMessageFromDB(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message deleted successfully',
    data: null,
  });
});

export const MessageController = {
  createMessage,
  getAllMessages,
  deleteMessage,
};