import { Types } from 'mongoose';
import { Rider } from '../rider/rider.model';
import { Chat } from './chat.model';

const saveMessage = async (payload: any) => {
  const { orderId, sender, senderModel, message } = payload;

  const existingChat = await Chat.findOne({
    orderId: new Types.ObjectId(orderId),
  });

  if (existingChat && existingChat.messages && existingChat.messages.length > 0) {
    const lastMessage = existingChat.messages[existingChat.messages.length - 1];

    if (lastMessage && lastMessage.time && lastMessage.sender) {
      const lastMessageTime = new Date(lastMessage.time).getTime();
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastMessageTime;

      if (
        lastMessage.sender.toString() === sender &&
        lastMessage.message === message &&
        timeDiff < 2000 
      ) {
        return existingChat;
      }
    }
  }

  const result = await Chat.findOneAndUpdate(
    { orderId: new Types.ObjectId(orderId) },
    { 
      $push: { 
        messages: { 
          sender: new Types.ObjectId(sender), 
          senderModel, 
          message,
          time: new Date() 
        } 
      } 
    },
    { 
      returnDocument: 'after',
      upsert: true, 
      runValidators: true 
    }
  ).populate({
    path: 'messages.sender',
    select: 'name avatarUrl role'
  });

  return result;
};



const getMessagesByOrder = async (orderId: string) => {
  const result = await Chat.findOne({ 
    orderId: new Types.ObjectId(orderId) 
  }).populate({
    path: 'messages.sender',
    select: 'name image role'
  });
  
  return result;
};

export const ChatService = {
  saveMessage,
  getMessagesByOrder
};