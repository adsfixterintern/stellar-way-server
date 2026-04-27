import { ITracking } from "./tracking.interface";
import { Tracking } from "./tracking.model";
import { Order } from "../order/order.model";
import mongoose from "mongoose";

const toObjectId = (id: string | mongoose.Types.ObjectId) =>
  new mongoose.Types.ObjectId(id.toString());

// -----------------------------
// UPDATE LIVE LOCATION
// -----------------------------
const updateLiveLocation = async (payload: Partial<ITracking>) => {
  const { orderId, currentLocation, status, riderId } = payload;

  if (!orderId || !riderId) {
    throw new Error("orderId and riderId are required");
  }

  const result = await Tracking.findOneAndUpdate(
    { orderId: toObjectId(orderId) },
    {
      $set: {
        currentLocation,
        status,
        riderId: toObjectId(riderId),
      },
    },
    { upsert: true, new: true },
  ).populate("riderId");

  if (status === "delivered") {
    await Order.findByIdAndUpdate(orderId, {
      deliveryStatus: "delivered",
    });
  }

  return result;
};

// -----------------------------
// GET TRACKING DATA
// -----------------------------
const getOrderTrackingData = async (orderId: string) => {
  const result = await Tracking.findOne({
    orderId: toObjectId(orderId),
  })
    .populate({
      path: "orderId",
      select: "deliveryStatus deliveryOTP address customerInfo transactionId",
    })
    .populate({
      path: "riderId",
      select: "name phone vehicleInfo",
    });

  if (!result) {
    throw new Error(
      "Tracking information not available yet. Rider not started.",
    );
  }

  return result;
};

export const TrackingService = {
  updateLiveLocation,
  getOrderTrackingData,
};
