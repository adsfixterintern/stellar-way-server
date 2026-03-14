import { IRider } from '../user/user.interface';
import { Rider, User } from '../user/user.model';


const createRiderIntoDB = async (payload: IRider) => {
 
  const user = await User.findById(payload.userId);
  if (!user) throw new Error('User not found!');
  await User.findByIdAndUpdate(payload.userId, { role: 'rider' });

  const newRider = await Rider.create(payload);
  return await newRider.populate('userId'); 
};



const getAllRidersFromDB = async () => {
  return await Rider.find().populate('userId');
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