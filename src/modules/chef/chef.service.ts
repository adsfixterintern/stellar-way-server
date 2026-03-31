import { IChef } from "./chef.interface";
import { Chef } from "./chef.model";

const createChefIntoDB = async (payload: IChef) => {
  return await Chef.create(payload);
};

const getAllChefsFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const result = await Chef.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Chef.countDocuments();

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

const getSingleChefFromDB = async (id: string) => {
  return await Chef.findById(id);
};

const updateChefInDB = async (id: string, payload: Partial<IChef>) => {
  return await Chef.findByIdAndUpdate(id, { $set: payload }, {
    returnDocument: "after",
    runValidators: true,
  });
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
