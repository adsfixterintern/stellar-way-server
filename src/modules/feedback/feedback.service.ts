import { ITestimonial } from './feedback.interface';
import { Testimonial } from './feedback.model';

// created testimonial api
const createFeedbackIntoDB = async (payload: ITestimonial) => {
  const result = await Testimonial.create(payload);
  return result;
};

// get testimonial whit pagination (3)
const getAllFeedbacksFromDB = async (query: Record<string, unknown>) => {
  const { status, page = 1, limit = 3 } = query;
  const filter = status ? { status } : {}; 

  const skip = (Number(page) - 1) * Number(limit);
  
  const result = await Testimonial.find(filter)
    .populate('userId') 
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  return { result, total: await Testimonial.countDocuments(filter) };
};
const updateFeedbackStatusIntoDB = async (id: string, payload: Partial<ITestimonial>) => {
  const result = await Testimonial.findByIdAndUpdate(id, payload, { 
    new: true, 
    runValidators: true 
  });
  return result;
};

const getMyFeedbacksFromDB = async (userId: string) => {
  const result = await Testimonial.find({ userId })
    .populate('userId')
    .sort({ createdAt: -1 });
  return result;
};

const deleteFeedbackFromDB = async (id: string) => {
  const result = await Testimonial.findByIdAndDelete(id);
  return result;
};

export const FeedbackServices = {
  createFeedbackIntoDB,
  getAllFeedbacksFromDB,
  updateFeedbackStatusIntoDB,
  getMyFeedbacksFromDB,
 deleteFeedbackFromDB
};