import { Request, Response } from "express";
import { FaqServices } from "./faq.service";

const createFaq = async (req: Request, res: Response) => {
  try {
    const faqData = req.body;
    const result = await FaqServices.createFaqIntoDB(faqData);

    res.status(201).json({
      success: true,
      message: "FAQ created successfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

export const FaqControllers = {
  createFaq,
};