import { Request, Response } from "express";
import { RestaurantStatsService } from "./restaurantStats.service";

const getStats = async (req: Request, res: Response) => {
  const result = await RestaurantStatsService.getStatsFromDB();

  res.status(200).json({
    success: true,
    message: "Restaurant stats fetched",
    data: result,
  });
};

const updateStats = async (req: Request, res: Response) => {
  const result = await RestaurantStatsService.updateStatsFromDB(req.body);

  res.status(200).json({
    success: true,
    message: "Restaurant stats updated",
    data: result,
  });
};
const createStats = async (req: Request, res: Response) => {
  const result = await RestaurantStatsService.createStatsIntoDB(req.body);

  res.status(201).json({
    success: true,
    message: "Stats created successfully",
    data: result,
  });
};

const deleteStats = async (req: Request, res: Response) => {
  const result = await RestaurantStatsService.deleteStatsFromDB();

  res.status(200).json({
    success: true,
    message: "Stats reset successfully",
    data: result,
  });
};

export const RestaurantStatsController = {
  createStats,
  getStats,
  updateStats,
  deleteStats,
};
