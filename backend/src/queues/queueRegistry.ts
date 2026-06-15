import emailQueue from "./emailQueue";
import webhookQueue from "./webhookQueue";
import reminderQueue from "./reminderQueue";
import reportQueue from "./reportQueue";
import cleanupQueue from "./cleanupQueue";

const queueRegistry = {
    EMAIL: emailQueue,
    WEBHOOK: webhookQueue,
    REMINDER: reminderQueue,
    REPORT: reportQueue,
    CLEANUP: cleanupQueue,
};

export default queueRegistry;