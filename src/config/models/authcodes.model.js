const mongoose = require('mongoose')

const authCodeSchema = mongoose.Schema({
    client_id:{type:String},
    redirect_uri:{type:String},
    user_id:{type:String},
    createdAt:{type:Date,expires:'5m',default:Date.now},
    used:{type:Boolean}
})

const Authorization = mongoose.model('codes',authCodeSchema)

module.exports = Authorization