import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { ChatService } from '../../modules/chat/chat.service';
import { TrackingService } from '../../modules/tracking/tracking.service'; // ট্র্যাকিং সার্ভিস ইম্পোর্ট করুন

export const setupSocket = (server: HttpServer) => {
  const io = new SocketServer(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket) => {
    socket.on('join-order', (orderId: string) => {
      socket.join(orderId);
      console.log(`User joined order room: ${orderId}`);
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
          status: data.status
        });

      } catch (error) {
        console.error('Socket location error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
};