import { IRider } from "./rider.interface";
import { Rider } from "./rider.model";
import { User } from "../user/user.model";
import mongoose from "mongoose";

// rider.service.ts
const applyForRiderIntoDB = async (payload: IRider) => {
  const isUserExists = await User.findById(payload.userId);
  if (!isUserExists) throw new Error('User not found!');

  const isAlreadyApplied = await Rider.findOne({ userId: payload.userId });
  if (isAlreadyApplied) throw new Error('You have already applied!');

  const isPhoneExists = await Rider.findOne({ phoneNumber: payload.phoneNumber });
  if (isPhoneExists) throw new Error('Phone number already registered!');

  const { status, rating, totalDeliveries, ...cleanData } = payload;

  const result = await Rider.create({
    ...cleanData,
    status: 'pending' ,
    rating: 0,         
    totalDeliveries: 0 
  } as any);
  
  return result;
};
const approveRiderInDB = async (riderId: string) => {
  const application = await Rider.findById(riderId);
  if (!application) throw new Error("Rider application not found!");

  const updatedRider = await Rider.findByIdAndUpdate(
    riderId,
    { status: "active" },
    { new: true },
  ).populate("userId");

  await User.findByIdAndUpdate(application.userId, { role: "rider" });
  return updatedRider;
};

const getAllRidersFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const result = await Rider.find()
    .populate("userId")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await Rider.countDocuments();

  return {
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
    data: result,
  };
};

const getSingleRiderFromDB = async (id: string) => {
  const result = await Rider.findById(id).populate("userId"); // এখানে id যুক্ত করা হয়েছে
  if (!result) throw new Error("Rider not found!");
  return result;
};

const updateRiderInDB = async (id: string, payload: Partial<IRider>) => {
  const { status, userId, ...updateData } = payload;
  return await Rider.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

const deleteRiderFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const rider = await Rider.findById(id).session(session);
    if (!rider) throw new Error("Rider not found!");

    await User.findByIdAndUpdate(rider.userId, { role: "user" }).session(
      session,
    );
    const result = await Rider.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const RiderServices = {
  applyForRiderIntoDB,
  approveRiderInDB,
  getAllRidersFromDB,
  getSingleRiderFromDB,
  updateRiderInDB,
  deleteRiderFromDB,
};
