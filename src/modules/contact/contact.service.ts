import { IContactMessage } from "./contact.interface";
import { Contact } from "./contact.model";


const createMessageIntoDB = async (payload: IContactMessage) => {
  const result = await Contact.create(payload);
  return result;
};


const getAllMessagesFromDB = async () => {
  const result = await Contact.find().sort({ createdAt: -1 });
  return result;
};


const deleteMessageFromDB = async (id: string) => {
  const result = await Contact.findByIdAndDelete(id);
  return result;
};

export const ContactService = {
  createMessageIntoDB,
  getAllMessagesFromDB,
  deleteMessageFromDB,
};
