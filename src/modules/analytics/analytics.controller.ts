import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';

const trackVisit = async (req: Request, res: Response) => {
  try {
    const { source } = req.body;
    const result = await AnalyticsService.trackVisitIntoDB(source);
    
    res.status(200).json({
      success: true,
      message: 'Visit tracked successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

const getTrafficStats = async (req: Request, res: Response) => {
  try {
    const result = await AnalyticsService.getTrafficStatsFromDB();
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const AnalyticsController = {
  trackVisit,
  getTrafficStats,
};