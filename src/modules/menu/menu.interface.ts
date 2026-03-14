import { Types } from 'mongoose';

export interface ICategory {
  name: string;
  sortOrder: number;
}

export interface IMenu {
  title: string;
  subTitle?: string;
  description: string;
  price: number;
  image: string;
  chefId: Types.ObjectId;
  categoryId: Types.ObjectId;
  stock: number; 
  discount: number;
  sortOrder: number;
  status: 'active' | 'inactive';
  totalOrder: number;
  reviews: {
    rating: number;
    comment: string;
    userId: Types.ObjectId;
  }[];
}

