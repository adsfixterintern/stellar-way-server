import { RestaurantStats } from "./restaurantStats.model";
import { IRestaurantStats } from "./restaurantStats.interface";

// CREATE (only if not exists)
const createStatsIntoDB = async (payload: IRestaurantStats) => {
  const existing = await RestaurantStats.findOne();

  if (existing) {
    return existing; // avoid duplicate stats doc
  }

  const result = await RestaurantStats.create(payload);
  return result;
};

// GET
const getStatsFromDB = async () => {
  let stats = await RestaurantStats.findOne();

  if (!stats) {
    stats = await RestaurantStats.create({
      happyClients: 0,
      yearsOfExperience: 0,
      totalDishes: 0,
      awards: 0,
      branches: 0,
    });
  }

  return stats;
};

// UPDATE
const updateStatsFromDB = async (payload: Partial<IRestaurantStats>) => {
  const stats = await RestaurantStats.findOne();

  if (!stats) {
    return await RestaurantStats.create(payload);
  }

  return await RestaurantStats.findByIdAndUpdate(stats._id, payload, {
    new: true,
  });
};

// DELETE (RESET instead of remove)
const deleteStatsFromDB = async () => {
  const stats = await RestaurantStats.findOne();

  if (!stats) {
    return null;
  }

  // safer than delete: reset values
  const reset = await RestaurantStats.findByIdAndUpdate(
    stats._id,
    {
      happyClients: 0,
      yearsOfExperience: 0,
      totalDishes: 0,
      awards: 0,
      branches: 0,
    },
    { new: true },
  );

  return reset;
};

export const RestaurantStatsService = {
  createStatsIntoDB,
  getStatsFromDB,
  updateStatsFromDB,
  deleteStatsFromDB,
};
