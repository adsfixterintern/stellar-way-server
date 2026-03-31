import { Types } from 'mongoose';


export interface IMenu {
  title: string;
  subTitle?: string;
  description: string;
  price: number;
  image: {
    url: string;
    publicId: string;
  };
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

