import { Request, Response } from "express";
import { TableService } from "./table.service";

// table.controller.ts

const createTable = async (req: Request, res: Response) => {
  try {
    // ইমেজ চেক
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an image" });
    }

    // বডি ডাটা প্রসেসিং
    const tableData = {
      ...req.body,
      image: req.file.path, // Cloudinary URL
      totalSeat: Number(req.body.totalSeat),
      tableNumber: req.body.tableNumber,
      position: req.body.position,
      description: req.body.description,
    };

    const result = await TableService.createTable(tableData);

    res.status(201).json({
      success: true,
      message: "Table created successfully!",
      data: result,
    });
  } catch (error: any) {
    // ডুপ্লিকেট কি (tableNumber) চেক
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Table number already exists!" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllTables = async (req: Request, res: Response) => {
  try {
    const result = await TableService.getAllTables();
    res.status(200).json({
      success: true,
      message: "Tables fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleTable = async (req: Request, res: Response) => {
  try {
    const result = await TableService.getSingleTable(req.params.id as string);
    res.status(200).json({
      success: true,
      message: "Table fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const TableController = {
  createTable,
  getAllTables,
  getSingleTable,
};
