import { IFaq } from "./faq.interface";
import { FaqModel } from "./faq.model";

const createFaqIntoDB = async (faqData: IFaq) => {
  const result = await FaqModel.create(faqData);
  return result;
};

export const FaqServices = {
  createFaqIntoDB,
};