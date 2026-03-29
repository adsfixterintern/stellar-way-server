import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { ChatService } from '../../modules/chat/chat.service';
import { TrackingService } from '../../modules/tracking/tracking.service';

export let io: SocketServer;

export const setupSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket) => {
    socket.on('join-order', (orderId: string) => {
      socket.join(orderId);
    });

    socket.on('join-notification', (userId: string) => {
      socket.join(userId);
    });

    socket.on('join-rider-room', () => {
      socket.join('all-riders');
    });

    socket.on('send-message', async (data) => {
      try {
        const updatedChat: any = await ChatService.saveMessage(data);
        if (updatedChat && updatedChat.messages) {
          const latestMsg = updatedChat.messages[updatedChat.messages.length - 1];
          io.to(data.orderId).emit('new-message', latestMsg);
        }
      } catch (error) {
        console.error('Socket chat error:', error);
      }
    });

    socket.on('update-location', async (data) => {
      try {
        await TrackingService.updateLiveLocation(data);
        io.to(data.orderId).emit('location-updates', {
          currentLocation: data.currentLocation,
          status: data.status,
          riderId: data.riderId
        });
        
        if (data.status === 'near-location') {
          io.to(data.orderId).emit('notification', {
            title: "Rider is nearby!",
            message: "Your rider is almost at your location. Please get ready with the OTP."
          });
        }
      } catch (error) {
        console.error('Socket location error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected')
    });
  });

  return io;
};