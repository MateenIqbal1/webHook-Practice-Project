const { Worker } = require("bullmq");
const redis = require("../config/redis");

const WebhookEvent = require("../models/webhook-event.model");

const webhookWorker = new Worker(
    "webhook-processing",

    async (job) => {

        console.log(
            "Processing job:",
            job.id
        );

        const { webhookEventId } = job.data;

        const webhook = await WebhookEvent.findById(
            webhookEventId
        );

        if (!webhook) {
            throw new Error("Webhook event not found");
        }

        await WebhookEvent.findByIdAndUpdate(
            webhookEventId,
            {
                status: "processing",
                $inc: {
                    attempts: 1
                }
            }
        );

        console.log(
            "Processing GitHub event:",
            webhook.event
        );

        console.log(
            "Repository:",
            webhook.payload.repository?.full_name
        );

        console.log(
            "Delivery:",
            webhook.deliveryId
        );

        // Simulate actual business processing
        console.log("Doing webhook business logic...");

        await WebhookEvent.findByIdAndUpdate(
            webhookEventId,
            {
                status: "processed"
            }
        );

        console.log(
            "Webhook processed successfully"
        );
    },

    {
        connection: redis
    }
);

webhookWorker.on("completed", (job) => {
    console.log(
        `Job ${job.id} completed`
    );
});

webhookWorker.on("failed", (job, error) => {
    console.error(
        `Job ${job?.id} failed:`,
        error.message
    );
});

console.log("Webhook worker started");