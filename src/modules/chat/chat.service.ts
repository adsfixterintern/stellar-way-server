import { IMessage } from './chat.interface';
import { Chat } from './chat.model';

const saveMessage = async (payload: IMessage) => {
  const result = await Chat.create(payload);
  return result;
};

const getMessagesByOrder = async (orderId: string) => {
  return await Chat.find({ orderId }).sort({ createdAt: 1 });
};

export const ChatService = {
  saveMessage,
  getMessagesByOrder
};