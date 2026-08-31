const mongoose = require('mongoose')

async function connectdb(){
  mongoose.connect(process.env.MONGO_URL).then(()=>{console.log("connected to mongodb Successfully")}).catch((error)=>console.log("Error while connecting to mongodb"))
}
module.exports = connectdb