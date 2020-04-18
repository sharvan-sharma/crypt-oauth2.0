const mongoose = require('mongoose')

const authCodeSchema = mongoose.Schema({
    client_id:{type:String},
    redirect_uri:{type:String},
    user_id:{type:String},
    expiresAt:{type:Date},
    used:{type:Boolean}
})

const Authorization = mongoose.model('codes',authCodeSchema)

module.exports = Authorization