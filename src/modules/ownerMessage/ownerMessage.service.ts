import { OwnerMessage } from "./ownerMessage.model";
import { IOwnerMessage } from "./ownerMessage.interface";

// CREATE
const createOwnerMessageIntoDB = async (payload: IOwnerMessage) => {
  const existing = await OwnerMessage.findOne();

  if (existing) {
    return existing; 
  }

  return await OwnerMessage.create(payload);
};

// GET
const getOwnerMessageFromDB = async () => {
  let data = await OwnerMessage.findOne();

  if (!data) {
    data = await OwnerMessage.create({
      message: "Welcome to our restaurant!",
      ownerName: "Owner",
      designation: "Founder",
      image: "",
    });
  }

  return data;
};

// UPDATE
const updateOwnerMessageIntoDB = async (payload: Partial<IOwnerMessage>) => {
  const existing = await OwnerMessage.findOne();

  if (!existing) {
    return await OwnerMessage.create(payload);
  }

  return await OwnerMessage.findByIdAndUpdate(existing._id, payload, {
    new: true,
  });
};

// DELETE (RESET instead of hard delete)
const deleteOwnerMessageFromDB = async () => {
  const existing = await OwnerMessage.findOne();

  if (!existing) return null;

  return await OwnerMessage.findByIdAndUpdate(
    existing._id,
    {
      message: "",
      ownerName: "",
      designation: "",
      image: "",
    },
    { new: true },
  );
};

export const OwnerMessageService = {
  createOwnerMessageIntoDB,
  getOwnerMessageFromDB,
  updateOwnerMessageIntoDB,
  deleteOwnerMessageFromDB,
};
