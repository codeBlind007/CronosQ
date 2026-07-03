import emailWorker from "./emailWorker";
import webhookWorker from "./webhook-worker";
console.log("Workers started");
console.log(`emailWorker active: ${emailWorker.name}`);
console.log(`webhookWorker active: ${webhookWorker.name}`);
