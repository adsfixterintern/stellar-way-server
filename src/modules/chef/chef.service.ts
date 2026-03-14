import { IChef } from "./chef.interface";
import { Chef } from "./chef.model";

const createChefIntoDB = async (payload: IChef) => {
  return await Chef.create(payload);
};

const getAllChefsFromDB = async () => {
  return await Chef.find();
};

const getSingleChefFromDB = async (id: string) => {
  return await Chef.findById(id);
};

const updateChefInDB = async (id: string, payload: Partial<IChef>) => {
  return await Chef.findByIdAndUpdate(id, payload, { new: true });
};

const deleteChefFromDB = async (id: string) => {
  return await Chef.findByIdAndDelete(id);
};

export const ChefServices = {
  createChefIntoDB,
  getAllChefsFromDB,
  getSingleChefFromDB,
  updateChefInDB,
  deleteChefFromDB,
};
