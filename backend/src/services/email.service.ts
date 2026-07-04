import { resend } from "../utils/resend";
import {AppError} from "../utils/AppError";
const fromEmail = process.env.RESEND_FROM_EMAIL || "";
console.log(fromEmail);

const emailService = async (to: string, subject: string, body: string) => {
    const {data, error} = await resend.emails.send({
        from : fromEmail,
        to,
        subject,
        html: body
    })

    if(error){
        console.error(error);
        throw new AppError("Failed to send email", 500);
    }

    return {
        sent: true,
        email: data?.id
    };
}

export default emailService;