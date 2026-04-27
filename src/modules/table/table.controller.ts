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



const updateTable = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const body = req.body;
    
    const updateData: any = { ...body };

    if (req.file) {
      updateData.image = req.file.path;
    }
    if (body.totalSeat) {
      updateData.totalSeat = Number(body.totalSeat);
    }

    const result = await TableService.updateTable(id as string, updateData);

    res.status(200).json({
      success: true,
      message: "Table updated successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTable = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await TableService.deleteTable(id as string);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Table not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Table deleted successfully!",
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
  updateTable, 
  deleteTable,
};
