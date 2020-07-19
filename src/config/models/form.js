const mongoose = require('mongoose')

const uriSchema = mongoose.Schema({
    uri:{type:String}
})

const formsSchema = mongoose.Schema({
    createdAt:{type:Date,default:Date.now},
    project_id:{type:String,required:true},
    name:{type:String,required:true},
    redirect_uris:[uriSchema],
    origin_uris:[uriSchema],
    client_id:{type:String},
    client_secret:{type:String,default:null},
    client_type:{type:String,required:true}
})

const Forms = mongoose.model('forms',formsSchema)

module.exports = Forms