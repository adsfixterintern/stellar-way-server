import { BookingRoutes } from "../../modules/booking/booking.route";
import { ChefRoutes } from "../../modules/chef/chef.route";

import { NotificationRoutes } from "../../modules/notification/notification.route";
import { Router } from "express";
import { MenuRoutes } from "../../modules/menu/menu.route";
import { MessageRoutes } from "../../modules/message/message.route";
import { CategoryRoutes } from "../../modules/category/category.route";
import { uploadRoutes } from "../../modules/upload/upload.route";
import { GalleryRoutes } from "../../modules/gallery/gallery.route";
import { ChatRoutes } from "../../modules/chat/chat.route";
import { TrackingRoutes } from "../../modules/tracking/tracking.route";
import { OrderRoutes } from "../../modules/order/order.route";
import { RiderRoutes } from "../../modules/rider/rider.route";

const router = Router();

const moduleRoutes = [
  { path: '/menu', route: MenuRoutes },
  { path: '/bookings', route: BookingRoutes },
  { path: '/chefs', route: ChefRoutes },
  // { path: "/menu", route: MenuRoutes },
  { path: "/notifications", route: NotificationRoutes },
  { path: "/messages", route: MessageRoutes },
  { path: "/categories", route: CategoryRoutes },
  { path: "/uploads", route: uploadRoutes },
  { path: "/gallery", route: GalleryRoutes },
  { path: "/chats", route: ChatRoutes },
  { path: "/tracking", route: TrackingRoutes },
  { path: "/orders", route: OrderRoutes },
  { path: '/riders', route: RiderRoutes },
  { path: "/chats", route: ChatRoutes },       
  { path: "/tracking", route: TrackingRoutes }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
