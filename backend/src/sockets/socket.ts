import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { authenticateSocket } from "./socketAuth";

export function createSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {

    const userId = socket.data.userId;

    socket.join(userId);

    console.log(`${userId} connected`);

    socket.on("disconnect", () => {
      console.log(`${userId} disconnected`);
    });
  });

  return io;
}