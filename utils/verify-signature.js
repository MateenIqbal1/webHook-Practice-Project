const crypto = require("crypto");

const verifySignature = (payload, signature, secret) => {
    const expectedSignature =
        "sha256=" +
        crypto
            .createHmac("sha256", secret)
            .update(payload)
            .digest("hex");

    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
    );
};

module.exports = verifySignature;