const mongoose = require("mongoose");

const webhookEventSchema = new mongoose.Schema(
    {
        deliveryId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        event: {
            type: String,
            required: true,
        },

        payload: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "processing", "processed", "failed"],
            default: "pending",
        },

        attempts: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("WebhookEvent",webhookEventSchema);