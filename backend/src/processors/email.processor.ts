import { Job } from "bullmq";

const emailProcessor = async (job: Job) => {
    console.log(`Processing email`);
    console.log("EMAIL");

    console.log(job.data);

    await new Promise(resolve =>
        setTimeout(resolve, 2000)
    );

    return {
        sent: true
    };
};

export default emailProcessor;