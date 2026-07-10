import { verifyToken } from "@clerk/backend";
import { Socket } from "socket.io";

export async function authenticateSocket(
  socket: Socket,
  next: (err?: Error) => void
) {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    console.log("Socket authentication successful:", payload);

    socket.data.userId = payload.sub;

    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
}