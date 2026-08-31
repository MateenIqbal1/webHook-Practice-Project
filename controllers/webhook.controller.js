const verifySignature = require("../utils/verify-signature");

const githubWebhook = (req, res) => {

    console.log("CONTENT TYPE:", req.headers["content-type"]);
console.log("RAW BODY:", req.body);
console.log("SIGNATURE:", req.headers["x-hub-signature-256"]);

    const signature = req.headers["x-hub-signature-256"];
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

    console.log("Valid GitHub webhook");

    console.log("Event:", req.headers["x-github-event"]);
    console.log("Delivery ID:", req.headers["x-github-delivery"]);
    console.log("Payload:", req.body);

    return res.status(200).json({
        success: true,
        message: "Webhook verified"
    });
};

module.exports = {
    githubWebhook
};