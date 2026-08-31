const express = require("express");
const { githubWebhook } = require("../controllers/webhook.controller");

const router = express.Router();

router.post("/webhooks/github", githubWebhook);

module.exports = router;