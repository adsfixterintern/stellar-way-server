import { IFaq } from './faq.interface';
import { Faq } from './faq.model';

// crat faq api
const createFaqIntoDB = async (payload: IFaq) => {
  const result = await Faq.create(payload);
  return result;
};

// get all faq api
const getAllFaqsFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
  const result = await Faq.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await Faq.countDocuments();
  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    result,
  };
};

// get single faq api
const getSingleFaqFromDB = async (id: string) => {
  const result = await Faq.findById(id);
  return result;
};

// update faq
const updateFaqIntoDB = async (id: string, payload: Partial<IFaq>) => {
  const result = await Faq.findByIdAndUpdate(id, payload, {
    new: true, 
    runValidators: true, 
  });

  return result;
};

// delete api 
const deleteFaqFromDB = async (id: string) => {
  const result = await Faq.findByIdAndDelete(id);
  return result;
};

export const FaqServices = {
  createFaqIntoDB,
  getAllFaqsFromDB,
  getSingleFaqFromDB,
  updateFaqIntoDB,
  deleteFaqFromDB,
};