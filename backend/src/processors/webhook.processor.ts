import axios from "axios";
import { Job } from "bullmq";
import {AppError} from "../utils/AppError";

const webhookProcessor = async (job: Job) => {
    console.log("Processing webhook");

    const { payload } = job.data;
    const { url, method = "POST", headers, body } = payload;

    try {
        const response = await axios({
            url,
            method,
            headers,
            data: body,
            timeout: 10000,
        });

        console.log("webhook response:", response.status, response.data);

        return {
            success: true,
            status: response.status,
            response: response.data,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(
                `Webhook request failed: ${error.response?.status} ${error.response?.statusText}`
            );
            console.error("Response:", error.response?.data);
        } else {
            console.error("Unexpected error:", error);
        }

        throw new AppError("Failed to process webhook", 500);
    }
};

export default webhookProcessor;