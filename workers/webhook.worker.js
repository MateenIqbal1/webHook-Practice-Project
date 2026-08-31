const { Worker } = require("bullmq");
const redis = require("../config/redis");
const WebhookEvent = require("../models/webhook-event.model");

const webhookWorker = new Worker(
    "webhook-processing",
    async (job) => {
        const { webhookEventId } = job.data;

        const webhook = await WebhookEvent.findById(webhookEventId);

        if (!webhook) {
            throw new Error("Webhook event not found");
        }

        await WebhookEvent.findByIdAndUpdate(
            webhookEventId,
            {
                status: "processing",
                $inc: { attempts: 1 }
            }
        );

        console.log(
            `Processing ${webhook.event} - Attempt ${job.attemptsMade + 1}`
        );

        if (job.attemptsMade < 2) {
            throw new Error("Temporary processing failure");
        }

        console.log("Webhook processed:", webhook.deliveryId);

        await WebhookEvent.findByIdAndUpdate(
            webhookEventId,
            { status: "processed" }
        );
    },
    {
        connection: redis
    }
);

webhookWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

webhookWorker.on("failed", async (job, error) => {
    console.log(`Job ${job?.id} failed: ${error.message}`);

    if (job && job.attemptsMade >= job.opts.attempts) {
        await WebhookEvent.findByIdAndUpdate(
            job.data.webhookEventId,
            { status: "failed" }
        );
    }
});

console.log("Webhook worker started");

module.exports = webhookWorker;