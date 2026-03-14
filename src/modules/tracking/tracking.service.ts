import { ITracking } from './tracking.interface';
import { Tracking } from './tracking.model';


const updateLiveLocation = async (payload: Partial<ITracking>) => {
  const { orderId, currentLocation, status, riderId } = payload;

  const result = await Tracking.findOneAndUpdate(
    { orderId  } as any, 
    { 
      $set: { 
        currentLocation, 
        status, 
        riderId,
        updatedAt: new Date() 
      } 
    },
    { upsert: true, new: true } 
  );

  return result;
};


const getOrderTrackingData = async (orderId: string) => {
  const result = await Tracking.findOne({ orderId })
    .populate('orderId')
    .populate('riderId');
    
  if (!result) {
    throw new Error('Tracking information not found for this order!');
  }
  
  return result;
};

export const TrackingService = {
  updateLiveLocation,
  getOrderTrackingData
};