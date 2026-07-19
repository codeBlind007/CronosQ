import { createServer } from "http";
import app from "./app";
import { createSocket } from "./sockets/socket";
import { startJobSubscriber } from "./events/subscriber";
import "./worker";
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

// Initialize Socket.IO
const io = createSocket(httpServer);

// Subscribe to Redis events
startJobSubscriber(io);

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});