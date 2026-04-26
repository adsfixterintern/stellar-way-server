import { Types } from "mongoose";

export interface ITracking {
  orderId: Types.ObjectId;
  riderId: Types.ObjectId;

  status: "order-picked" | "on-the-way" | "near-location" | "delivered";

  currentLocation?: {
    lat: number;
    lng: number;
  };

  createdAt?: Date;
  updatedAt?: Date;
}
