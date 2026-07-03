import {Job} from "bullmq"

export const webhookProcessor = async (job: Job) => {
    console.log(`Processing webhook`);

    const {payload} = job.data;
    const {url, method, headers, body} = payload;

    try {
        const response = await fetch(url, {
            method,
            headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Webhook request failed with status ${response.status}: ${errorText}`);
            throw new Error(`Webhook request failed with status ${response.status}`);
        }

        return {
            success: true,
            response: await response.json()
        }

    } catch (error) {
        console.error(`Error processing webhook: ${error}`);
        throw error;
    }
};