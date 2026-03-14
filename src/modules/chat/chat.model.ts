import { Schema, model } from 'mongoose';
import { IMessage } from './chat.interface';

const chatSchema = new Schema<IMessage>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  sender: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    refPath: 'senderModel' 
  },
  senderModel: { 
    type: String, 
    required: true, 
    enum: ['User', 'Rider'] 
  },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export const Chat = model<IMessage>('Chat', chatSchema);