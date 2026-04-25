import { IOffer } from "./offer.interface";
import { Offer } from "./offer.model";

const createOfferIntoDB = async (payload: IOffer) => {
  return await Offer.create(payload);
};

const getActiveOffersFromDB = async () => {
  const now = new Date();
  return await Offer.find({
    isActive: true,
  }).populate("applicableMenus");
};

const deleteOfferFromDB = async (id: string) => {
  return await Offer.findByIdAndDelete(id);
};

export const OfferService = {
  createOfferIntoDB,
  getActiveOffersFromDB,
  deleteOfferFromDB,
};
