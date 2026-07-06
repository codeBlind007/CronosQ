import emailWorker from "./emailWorker";
import webhookWorker from "./webhook-worker";
import reminderWorker from "./reminder-worker";


console.log("Workers started");
console.log(`emailWorker active: ${emailWorker.name}`);
console.log(`webhookWorker active: ${webhookWorker.name}`);
console.log(`reminderWorker active: ${reminderWorker.name}`);
