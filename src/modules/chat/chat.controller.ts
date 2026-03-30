import { Request, Response } from 'express';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { ChatService } from './chat.service';

const saveMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await ChatService.saveMessage(req.body);
  
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Message sent and saved successfully',
    data: result,
  });
});

const getOrderMessages = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const result = await ChatService.getMessagesByOrder(orderId as string);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Chat history retrieved successfully',
    data: result,
  });
});

export const ChatController = {
  saveMessage,
  getOrderMessages
};