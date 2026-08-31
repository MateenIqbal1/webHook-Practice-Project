const webhookEventModel = require("../models/webhook-event.model");
const webhookQueue = require("../queues/webook.queue");
const verifySignature = require("../utils/verify-signature");

const githubWebhook = async (req, res) => {
    try {

        const signature = req.headers["x-hub-signature-256"];
        const deliveryId = req.headers["x-github-delivery"];
        const event = req.headers["x-github-event"];

        if (!signature) {
            return res.status(401).json({
                success: false,
                message: "Missing webhook signature"
            });
        }


        const isValid = verifySignature(
            req.rawBody,
            signature,
            process.env.GITHUB_WEBHOOK_SECRET
        );

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid webhook signature"
            });
        }



        if (!deliveryId) {
            return res.status(400).json({
                success: false,
                message: "Missing GitHub delivery ID"
            });
        }

        try {
            const webhook = await webhookEventModel.create({
                deliveryId,
                event,
                payload: req.body,
                status: "pending"
            });

            console.log("Webhook saved:", webhook._id);

            await webhookQueue.add(
                "process-webhook",
                {
                    webhookEventId: webhook._id.toString()
                },
                {
                    attempts: 3,

                    backoff: {
                        type: "exponential",
                        delay: 2000
                    }
                }
            );

            console.log("Webhook job added to queue");
        } catch (error) {

            if (error.code === 11000) {

                console.log(
                    "Duplicate webhook:",
                    deliveryId
                );

                return res.status(200).json({
                    success: true,
                    message: "Webhook already received"
                });
            }
            throw error;
        }

        return res.status(200).json({
            success: true,
            message: "Webhook received"
        });

    } catch (error) {

        console.error(
            "Webhook error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    githubWebhook
};