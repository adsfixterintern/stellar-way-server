"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = exports.io = void 0;
const socket_io_1 = require("socket.io");
const chat_service_1 = require("../../modules/chat/chat.service");
const tracking_service_1 = require("../../modules/tracking/tracking.service");
const setupSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: { origin: '*', methods: ['GET', 'POST'] },
    });
    io.on('connection', (socket) => {
        socket.on('join-order', (orderId) => {
            socket.join(orderId);
            console.log(`User joined order room: ${orderId}`);
        });
        socket.on('join-notification', (userId) => {
            socket.join(userId);
            console.log(`User joined notification room: ${userId}`);
        });
        socket.on('send-message', async (data) => {
            try {
                const updatedChat = await chat_service_1.ChatService.saveMessage(data);
                if (updatedChat && updatedChat.messages) {
                    const latestMsg = updatedChat.messages[updatedChat.messages.length - 1];
                    io.to(data.orderId).emit('new-message', latestMsg);
                }
            }
            catch (error) {
                console.error('Socket chat error:', error);
            }
        });
        socket.on('update-location', async (data) => {
            try {
                await tracking_service_1.TrackingService.updateLiveLocation(data);
                io.to(data.orderId).emit('location-updates', {
                    currentLocation: data.currentLocation,
                    status: data.status
                });
            }
            catch (error) {
                console.error('Socket location error:', error);
            }
        });
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
    return io;
};
exports.setupSocket = setupSocket;
