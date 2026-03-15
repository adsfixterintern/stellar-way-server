import { ITestimonial } from './feedback.interface';
import { Testimonial } from './feedback.model';

// created testimonial api
const createFeedbackIntoDB = async (payload: ITestimonial) => {
  const result = await Testimonial.create(payload);
  return result;
};

// get testimonial whit pagination (3)
const getAllFeedbacksFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 3;
    const skip = (page - 1) * limit;
  const result = await Testimonial.find()
    // .populate('userId')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); 
  const total = await Testimonial.countDocuments();
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

export const FeedbackServices = {
  createFeedbackIntoDB,
  getAllFeedbacksFromDB,
};