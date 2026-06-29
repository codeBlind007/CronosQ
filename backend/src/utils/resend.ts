import { Resend } from "resend";
process.env.RESEND_API_KEY = process.env.RESEND_API_KEY || "";
console.log("Resend API Key: ", process.env.RESEND_API_KEY);

export const resend = new Resend(process.env.RESEND_API_KEY);