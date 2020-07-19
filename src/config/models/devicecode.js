const mongoose = require('mongoose')

const deviceCodeSchema = mongoose.Schema({
    user_code:{type:String,required:true},
    last:{type:Date,default:Date.now},
    createdAt:{type:Date,default:Date.now,expires:'30m'},
    user_id:{type:String,default:null},
    client_doc_id:{type:String,default:null},
    scope:[{type:String}],
    decision:{type:String,default:null}
})

const DeviceCodes = mongoose.model('device_codes',deviceCodeSchema)

module.exports = DeviceCodes