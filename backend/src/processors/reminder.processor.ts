import {Job} from "bullmq";
import {prisma} from "../utils/prisma";
import emailService from "../services/email.service";
import { AppError } from "../utils/AppError";

async function reminderProcessor(job: Job) {
    try{
        console.log(`Processing reminder job with id: ${job.id}`);
    
        const {payload} = job.data;
        const {userId} = job.data;
        const {title, message, channels} = payload;
    
        if(channels.includes("EMAIL")){
            const email = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    email: true,
                },
            });
            
            if(!email || !email.email){
                throw new AppError("User email not found", 404);
            }
            await emailService(email.email, title, message);
        }
    
        // by default in-app notifications
    
        await prisma.notificationChannel.create({
            data: {
                userId,
                title,
                message,
            },
        });
    
        return {
            success: true,
            title,
            message,
        }
    }catch(error){
        console.error("Error processing reminder job:", error);
        throw new AppError("Failed to process reminder", 500);
    }

}

export default reminderProcessor;