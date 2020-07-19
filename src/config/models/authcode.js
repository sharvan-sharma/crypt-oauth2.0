const mongoose = require('mongoose')

const authCodeSchema = mongoose.Schema({
    client_id:{type:String,required:true},
    redirect_uri:{type:String,required:true},
    used:{type:Boolean,default:false},
    user_id:{type:String,required:true},
    createdAt:{type:Date,expires:'10m',default:Date.now},
    code_challenge:{type:String,default:null},
    code_challenge_method:{type:String,default:null},
})

const AuthCodes = mongoose.model('auth_codes',authCodeSchema)

module.exports = AuthCodes