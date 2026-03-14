import { IMessage } from './message.interface';
import { Message } from './message.model';

const sendMessageIntoDB = async (payload: IMessage) => {
  const result = await Message.create(payload);
  return result;
};

const getAllMessagesFromDB = async (query: Record<string, unknown>) => {
  // Pagination logic
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

  const result = await Message.find()
    .sort({ date: -1 }) 
    .skip(skip)
    .limit(limit);

  const total = await Message.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: result,
  };
};

const deleteMessageFromDB = async (id: string) => {
  const result = await Message.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Message not found to delete!');
  }
  return result;
};

export const MessageService = {
  sendMessageIntoDB,
  getAllMessagesFromDB,
  deleteMessageFromDB,
};