import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export async function connectSocket(
  getToken: () => Promise<string | null>
) {
  if (socket?.connected) return socket;

  const token = await getToken();

  socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
    auth: {
      token,
    },
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