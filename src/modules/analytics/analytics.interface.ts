export interface ITrafficSource {
  source: 'direct' | 'social' | 'organic';
  count: number;
  date: string; // YYYY-MM-DD ফরম্যাটে রাখলে সার্চ করা সহজ
}