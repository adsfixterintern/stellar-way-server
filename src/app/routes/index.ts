import { Router } from "express";
import { MenuRoutes } from "../../modules/menu/menu.route";
import { UserRoutes } from "../../modules/user/user.route";
import { BookingRoutes } from "../../modules/booking/booking.route";
import { ChefRoutes } from "../../modules/chef/chef.route";

import { NotificationRoutes } from "../../modules/notification/notification.route";

import { MessageRoutes } from "../../modules/message/message.route";
import { CategoryRoutes } from "../../modules/category/category.route";
import { uploadRoutes } from "../../modules/upload/upload.route";
import { GalleryRoutes } from "../../modules/gallery/gallery.route";
import { ChatRoutes } from "../../modules/chat/chat.route";
import { TrackingRoutes } from "../../modules/tracking/tracking.route";
import { OrderRoutes } from "../../modules/order/order.route";
import { RiderRoutes } from "../../modules/rider/rider.route";
import { SettingsRoutes } from "../../modules/settings/settings.route";
import path from "node:path";
import { BlogRoutes } from "../../modules/blog/blog.route";

import { FaqRoutes } from "../../modules/faq/faq.routes";
import { FeedbackRoutes } from "../../modules/feedback/feedback.route";
import { EventRoutes } from "../../modules/event/event.route";

import { EventBookingRoutes } from "../../modules/event-booking/eventBooking.route";
import { AnalyticsRoutes } from "../../modules/analytics/analytics.route";
const router = Router();

const moduleRoutes = [
  { path: "/menu", route: MenuRoutes },
  { path: "/auth", route: UserRoutes },
  { path: "/bookings", route: BookingRoutes },
  { path: "/chefs", route: ChefRoutes },
  {
    path: "/menu",
    route: MenuRoutes,
  },
  {
    path: "/faq",
    route: FaqRoutes,
  },
  {
    path: "/feedback",
    route: FeedbackRoutes,
  },
  {
    path: "/events",
    route: EventRoutes,
  },
  {
    path: "/event-bookings",
    route: EventBookingRoutes,
  },
  { path: "/menu", route: MenuRoutes },
  { path: "/auth", route: UserRoutes },
  { path: "/bookings", route: BookingRoutes },
  { path: "/chefs", route: ChefRoutes },
  // { path: "/menu", route: MenuRoutes },
  { path: "/notifications", route: NotificationRoutes },
  { path: "/messages", route: MessageRoutes },
  { path: "/categories", route: CategoryRoutes },
  { path: "/uploads", route: uploadRoutes },
  { path: "/gallery", route: GalleryRoutes },
  { path: "/chats", route: ChatRoutes },
  { path: "/tracking", route: TrackingRoutes },
  { path: "/orders", route: OrderRoutes },
  { path: "/riders", route: RiderRoutes },
  { path: "/chats", route: ChatRoutes },
  { path: "/tracking", route: TrackingRoutes },
  { path: "/settings", route: SettingsRoutes },
  { path: "/riders", route: RiderRoutes },
  { path: "/chats", route: ChatRoutes },
  { path: "/tracking", route: TrackingRoutes },
  { path: "/blogs", route: BlogRoutes },
  { 
    path: "/analytics", 
    route: AnalyticsRoutes 
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
