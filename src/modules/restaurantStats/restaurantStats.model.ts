import { Schema, model } from "mongoose";
import { IRestaurantStats } from "./restaurantStats.interface";

const restaurantStatsSchema = new Schema<IRestaurantStats>(
  {
    happyClients: { type: Number, default: 0 },
    yearsOfExperience: { type: Number, default: 0 },
    totalDishes: { type: Number, default: 0 },
    awards: { type: Number, default: 0 },
    branches: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const RestaurantStats = model<IRestaurantStats>(
  "RestaurantStats",
  restaurantStatsSchema,
);
