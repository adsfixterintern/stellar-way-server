import { IOffer } from "./offer.interface";
import { Offer } from "./offer.model";

const createOfferIntoDB = async (payload: IOffer) => {
  return await Offer.create(payload);
};

const getAllOffersFromDB = async () => {

  return await Offer.find()
    .populate("applicableMenus");
};

const getActiveOffersFromDB = async () => {
  const now = new Date();

  return await Offer.find({
    isActive: true, 
    endDate: { $gte: now }, 
  })
    .sort({ startDate: 1 })
    .populate("applicableMenus");
};

// --- UPDATE OFFER LOGIC ---
const updateOfferIntoDB = async (id: string, payload: Partial<IOffer>) => {
  return await Offer.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteOfferFromDB = async (id: string) => {
  return await Offer.findByIdAndDelete(id);
};

export const OfferService = {
  createOfferIntoDB,
  getActiveOffersFromDB,
  updateOfferIntoDB,
  deleteOfferFromDB,
  getAllOffersFromDB
};
