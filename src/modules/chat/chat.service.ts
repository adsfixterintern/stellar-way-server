import { Types } from 'mongoose';
import { Chat } from './chat.model';

const saveMessage = async (payload: any) => {
  const { orderId, sender, senderModel, message } = payload;


  const result = await Chat.findOneAndUpdate(
    { orderId: new Types.ObjectId(orderId) },
    { 
      $push: { 
        messages: { 
          sender: new Types.ObjectId(sender), 
          senderModel, 
          message 
        } 
      } 
    },
    { 
      new: true, 
      upsert: true,
      runValidators: true 
    }
  );

  return result;
};

const getMessagesByOrder = async (orderId: string) => {
  const result = await Chat.findOne({ 
    orderId: new Types.ObjectId(orderId) 
  }).populate('messages.sender');
  
  return result;
};

export const ChatService = {
  saveMessage,
  getMessagesByOrder
};