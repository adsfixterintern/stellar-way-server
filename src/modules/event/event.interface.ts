import { Types } from "mongoose";

export interface IEvent {
  title: string;
  subTitle?: string;
  date: string;
  time: string;
  image: string;
  seat: number;
  availableSeat: number;
  price: number;
  status: "active" | "expired";
  featured: boolean;
}
