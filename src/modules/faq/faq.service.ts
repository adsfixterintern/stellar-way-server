import { IFaq } from './faq.interface';
import { Faq } from './faq.model';


const createFaqIntoDB = async (payload: IFaq) => {
  const result = await Faq.create({
    ...payload,
    status: payload.status || 'active'
  });
  return result;
};


const getAllFaqsFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  
  const filter: any = {};
  if (query.status) {
    filter.status = query.status;
  }

  const result = await Faq.find(filter) 
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Faq.countDocuments(filter); 
  const totalPage = Math.ceil(total / limit);

  return {
    meta: { page, limit, total, totalPage },
    result,
  };
};

const getSingleFaqFromDB = async (id: string) => {
  return await Faq.findById(id);
};


const updateFaqIntoDB = async (id: string, payload: Partial<IFaq>) => {
  const result = await Faq.findByIdAndUpdate(id, payload, {
    returnDocument: 'after', 
    runValidators: true, 
  });
  return result;
};

const deleteFaqFromDB = async (id: string) => {
  return await Faq.findByIdAndDelete(id);
};

export const FaqServices = {
  createFaqIntoDB,
  getAllFaqsFromDB,
  getSingleFaqFromDB,
  updateFaqIntoDB,
  deleteFaqFromDB,
};