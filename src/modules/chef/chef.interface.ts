import { Types } from 'mongoose';

export interface IReview {
  rating: number;
  comment?: string;
  userId: Types.ObjectId;
  menuId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChef {
  name: string;
  image: string;
  designation: string;
  bio: string;
  speciality: string;
  rating: number;
  status: 'active' | 'inactive' | 'suspended';
  reviews?: IReview[]; // ✅ শুধু এটা add করুন
}