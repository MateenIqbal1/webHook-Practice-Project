const express = require("express");

const router = express.Router();

router.post("/webhooks/github", (req, res) => {
    console.log("GitHub webhook received");

    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
       
    return res.status(200).json({
        success: true,
        message: "Webhook received"
    });
});

module.exports = router;