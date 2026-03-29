import { Traffic } from './analytics.model';
import { ITrafficSource } from './analytics.interface';

// ১. টাইপ সেফটির জন্য সোর্স টাইপ ডিফাইন করা (interface থেকে আসবে)
type TSource = ITrafficSource['source'];

const trackVisitIntoDB = async (source: TSource) => {
  const today = new Date().toISOString().split('T')[0];
  
  // অনেক সময় Mongoose এর FilterQuery ঠিকমতো ইনফার করতে পারে না
  // তাই এখানে টাইপ কাস্টিং ব্যবহার করা নিরাপদ
  const result = await Traffic.findOneAndUpdate(
    { source, date: today } as any, // 'as any' অথবা 'as FilterQuery<ITrafficSource>' দিলে এরর চলে যাবে
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );
  return result;
};

const getTrafficStatsFromDB = async () => {
  const stats = await Traffic.aggregate([
    {
      $group: {
        _id: "$source",
        totalCount: { $sum: "$count" }
      }
    }
  ]);

  const result = { direct: 0, social: 0, organic: 0 };
  
  stats.forEach((item) => {
    // এখানে item._id কে keyof typeof result হিসেবে চেক করা হচ্ছে
    if (item._id in result) {
      result[item._id as keyof typeof result] = item.totalCount;
    }
  });

  return result;
};

export const AnalyticsService = {
  trackVisitIntoDB,
  getTrafficStatsFromDB,
};