import { IRider } from '../user/user.interface';
import { Rider, User } from '../user/user.model';


const createRiderIntoDB = async (payload: IRider) => {
 
  const user = await User.findById(payload.userId);
  if (!user) throw new Error('User not found!');
  await User.findByIdAndUpdate(payload.userId, { role: 'rider' });

  const newRider = await Rider.create(payload);
  return await newRider.populate('userId'); 
};


const getAllRidersFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const result = await Rider.find()
    .populate('userId')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Rider.countDocuments();

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

const getSingleRiderFromDB = async (id: string) => {
  return await Rider.findById(id).populate('userId');
};

const updateRiderInDB = async (id: string, payload: Partial<IRider>) => {
  return await Rider.findByIdAndUpdate(id, payload, { new: true });
};

const deleteRiderFromDB = async (id: string) => {
  return await Rider.findByIdAndDelete(id);
};

export const RiderServices = {
  createRiderIntoDB,
  getAllRidersFromDB,
  getSingleRiderFromDB,
  updateRiderInDB,
  deleteRiderFromDB,
};