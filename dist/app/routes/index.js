"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menu_route_1 = require("../../modules/menu/menu.route");
const user_route_1 = require("../../modules/user/user.route");
const booking_route_1 = require("../../modules/booking/booking.route");
const chef_route_1 = require("../../modules/chef/chef.route");
const notification_route_1 = require("../../modules/notification/notification.route");
const message_route_1 = require("../../modules/message/message.route");
const category_route_1 = require("../../modules/category/category.route");
const upload_route_1 = require("../../modules/upload/upload.route");
const gallery_route_1 = require("../../modules/gallery/gallery.route");
const chat_route_1 = require("../../modules/chat/chat.route");
const tracking_route_1 = require("../../modules/tracking/tracking.route");
const order_route_1 = require("../../modules/order/order.route");
const rider_route_1 = require("../../modules/rider/rider.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    { path: '/menu', route: menu_route_1.MenuRoutes },
    { path: '/auth', route: user_route_1.UserRoutes },
    { path: '/bookings', route: booking_route_1.BookingRoutes },
    { path: '/chefs', route: chef_route_1.ChefRoutes },
    // { path: "/menu", route: MenuRoutes },
    { path: "/notifications", route: notification_route_1.NotificationRoutes },
    { path: "/messages", route: message_route_1.MessageRoutes },
    { path: "/categories", route: category_route_1.CategoryRoutes },
    { path: "/uploads", route: upload_route_1.uploadRoutes },
    { path: "/gallery", route: gallery_route_1.GalleryRoutes },
    { path: "/chats", route: chat_route_1.ChatRoutes },
    { path: "/tracking", route: tracking_route_1.TrackingRoutes },
    { path: "/orders", route: order_route_1.OrderRoutes },
    { path: '/riders', route: rider_route_1.RiderRoutes },
    { path: "/chats", route: chat_route_1.ChatRoutes },
    { path: "/tracking", route: tracking_route_1.TrackingRoutes }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
