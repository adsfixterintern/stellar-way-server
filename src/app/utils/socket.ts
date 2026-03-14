import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { ChatService } from '../../modules/chat/chat.service';
import { TrackingService } from '../../modules/tracking/tracking.service';

interface IChatData {
  orderId: string;
  sender: string;
  senderModel: 'User' | 'Rider';
  message: string;
}

interface ILocationData {
  orderId: string;
  currentLocation: { lat: number; lng: number };
  status: string;
}

export const setupSocket = (server: HttpServer) => {
  const io = new SocketServer(server, {
    cors: {
      origin: '*', 
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(' A user connected:', socket.id);


    socket.on('join-order', (orderId: string) => {
      socket.join(orderId);
      console.log(` User joined order room: ${orderId}`);
    });


    socket.on('send-message', async (data:IChatData) => {
      try {
        const savedMsg = await ChatService.saveMessage(data as any);
        
        io.to(data.orderId).emit('new-message', savedMsg);
      } catch (error) {
        console.error('Socket message error:', error);
      }
    });

    socket.on('update-location', async (data:ILocationData) => {
      try {
        await TrackingService.updateLiveLocation(data as any);
        io.to(data.orderId).emit('location-updates', data.currentLocation);
      } catch (error) {
        console.error('Socket location error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected');
    });
  });

  return io;
};
