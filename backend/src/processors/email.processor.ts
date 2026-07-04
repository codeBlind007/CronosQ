import { Job } from "bullmq";
import { resend } from "../utils/resend";
import {AppError} from "../utils/AppError";
import emailService from "../services/email.service";

const emailProcessor = async (job: Job) => {
    try{
        console.log(`Processing email`);
        console.log("EMAIL");
        const {payload} = job.data;
        const {to, body, subject} = payload;
    
        const response = await emailService(to, subject, body);
    
        return {
            sent: true,
            email: response.email
        };
        
    }catch(error){
        console.error("Error processing email job:", error);
        throw new AppError("Failed to process email job", 500);
    }
};

export default emailProcessor;