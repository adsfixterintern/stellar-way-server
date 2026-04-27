import { Types, isValidObjectId } from "mongoose";
import { Chat } from "./chat.model";

export type SenderModel = "User" | "Rider";

export interface ISaveMessagePayload {
  orderId: string;
  sender: string;
  senderModel: string; // 👈 flexible input (fixes TS issue)
  message: string;
}

// -----------------------------
// NORMALIZER (IMPORTANT FIX)
// -----------------------------
const normalizeSenderModel = (value: string): SenderModel => {
  return value?.toLowerCase() === "rider" ? "Rider" : "User";
};

// -----------------------------
// SAVE MESSAGE
// -----------------------------
const saveMessage = async (payload: ISaveMessagePayload) => {
  const { orderId, sender, senderModel, message } = payload;

  console.log("CHAT PAYLOAD:", payload);

  // ✅ Validation
  if (!orderId || !sender || !senderModel || !message) {
    throw new Error("Missing required fields");
  }

  // ✅ ObjectId validation
  if (!isValidObjectId(orderId) || !isValidObjectId(sender)) {
    throw new Error("Invalid ObjectId");
  }

  // ✅ FIX: normalize senderModel safely
  const normalizedSenderModel: SenderModel = normalizeSenderModel(senderModel);

  const existingChat = await Chat.findOne({
    orderId: new Types.ObjectId(orderId),
  });

  // ✅ Prevent duplicate spam messages
  const lastMessage = existingChat?.messages?.at(-1);

  if (lastMessage) {
    const lastTime = lastMessage.time
      ? new Date(lastMessage.time).getTime()
      : 0;

    const now = Date.now();

    if (
      lastMessage.sender?.toString() === sender &&
      lastMessage.message === message &&
      now - lastTime < 2000
    ) {
      return existingChat;
    }
  }

  // ✅ Save message
  const result = await Chat.findOneAndUpdate(
    { orderId: new Types.ObjectId(orderId) },
    {
      $push: {
        messages: {
          sender: new Types.ObjectId(sender),
          senderModel: normalizedSenderModel,
          message,
          time: new Date(),
        },
      },
    },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
    },
  ).populate({
    path: "messages.sender",
    select: "name image avatarUrl role",
  });

  return result;
};

// -----------------------------
// GET MESSAGES
// -----------------------------
const getMessagesByOrder = async (orderId: string) => {
  if (!isValidObjectId(orderId)) return null;

  return Chat.findOne({
    orderId: new Types.ObjectId(orderId),
  }).populate({
    path: "messages.sender",
    select: "name image avatarUrl role",
  });
};

export const ChatService = {
  saveMessage,
  getMessagesByOrder,
};
