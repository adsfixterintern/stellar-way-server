import { Server as SocketServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { ChatService } from "../../modules/chat/chat.service";
import { TrackingService } from "../../modules/tracking/tracking.service";

export let io: SocketServer;

type SenderModel = "User" | "Rider";

interface SendMessagePayload {
  orderId: string;
  sender: string;
  senderModel: SenderModel;
  message: string;
}

interface LocationPayload {
  orderId: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
}

export const setupSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket: Socket) => {
    console.log("Socket connected:", socket.id);

    // ---------------------------
    // JOIN ORDER ROOM
    // ---------------------------
    socket.on("join-order", (orderId: string) => {
      if (!orderId) return;
      socket.join(orderId);
    });

    // ---------------------------
    // CHAT MESSAGE
    // ---------------------------
    socket.on("send-message", async (data: SendMessagePayload) => {
      try {
        console.log("SOCKET MESSAGE:", data);

        if (
          !data?.orderId ||
          !data?.sender ||
          !data?.message ||
          !data?.senderModel
        ) {
          console.log("Invalid chat payload");
          return;
        }

        const updatedChat = await ChatService.saveMessage(data);

        const latestMsg = updatedChat?.messages?.at(-1);

        if (latestMsg) {
          io.to(data.orderId).emit("new-message", latestMsg);
        }
      } catch (error) {
        console.error("Socket Chat Error:", error);
      }
    });

    // ---------------------------
    // LIVE LOCATION TRACKING
    // ---------------------------
    socket.on("update-location", async (data: any) => {
      try {
        if (!data?.orderId || !data?.currentLocation || !data?.riderId) return;

        await TrackingService.updateLiveLocation({
          orderId: data.orderId,
          riderId: data.riderId,
          status: data.status,
          currentLocation: data.currentLocation,
        });

        io.to(data.orderId).emit("location-updates", {
          orderId: data.orderId,
          currentLocation: data.currentLocation,
          status: data.status,
        });
      } catch (error) {
        console.error(error);
      }
    });

    // ---------------------------
    // DISCONNECT
    // ---------------------------
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};
