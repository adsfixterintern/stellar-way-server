import { Schema, model } from 'mongoose';
import { IChat } from './chat.interface';

const messageSchema = new Schema({
  sender: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    refPath: 'messages.senderModel' 
  },
  senderModel: { 
    type: String, 
    required: true, 
    enum: ['User', 'Rider'] 
  },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  time: { type: Date, default: Date.now }
});

const chatSchema = new Schema<IChat>({
  orderId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true, 
    unique: true 
  },
  messages: [messageSchema]
}, { timestamps: true });

export const Chat = model<IChat>('Chat', chatSchema);