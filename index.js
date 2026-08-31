const express = require('express')
const app = express()
const connectdb = require('./config/db')
const redis = require('./config/redis')
require('dotenv').config()

const webHookRouter = require('./routes/webhook.routes')

app.use(
    express.json({
        verify: (req, res, buf) => {
            req.rawBody = buf;
        }
    })
);

app.use(webHookRouter)

app.listen(process.env.PORT, async() => {
console.log(`Server Running on ${process.env.PORT}`);
}); 
//this is db conc
connectdb()