import {JOB_EVENTS_CHANNEL, subscriber} from "../utils/redis";
import {Server} from "socket.io";

export function startJobSubscriber(io: Server) {
  subscriber.subscribe(JOB_EVENTS_CHANNEL, (err) => {
    if (err) {
      console.error("Failed to subscribe:", err);
      return;
    }

    console.log(`Subscribed to ${JOB_EVENTS_CHANNEL}`);
  });

  subscriber.on("message", (channel, message) => {
    if (channel !== JOB_EVENTS_CHANNEL) return;

    const event = JSON.parse(message);

    console.log(event);

    io.to(event.userId).emit("job:update", event);
  });
}