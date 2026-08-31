const { Queue } = require("bullmq");
const redis = require("../config/redis");

const webhookQueue = new Queue("webhook-processing", {
    connection: redis,
});

module.exports = webhookQueue;