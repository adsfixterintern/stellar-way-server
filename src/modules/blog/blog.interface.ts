import { Types } from 'mongoose';

export interface IBlogSection {
  title: string;
  desc: string;
  image?: string;
}

export interface IBlog {
  thumbnail: string;
  blogTitle: string;
  blogSubtitle: string;
  contentSections: IBlogSection[]; 
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  status: 'draft' | 'published';
  publishDate?: Date;
}