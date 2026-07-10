import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export async function connectSocket(getToken: () => Promise<string | null>) {
  console.log("connectSocket called");
  if (socket?.connected) return socket;

  const token = await getToken();
  console.log("Token retrieved:", token);
  socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log("Connected:", socket?.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Connection error:", err.message);
  });

  socket.on("job:update", (event) => {
    console.log("Job update received:", event);
  });

  socket.on("disconnect", (reason) => {
    console.log("Disconnected:", reason);
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
