const mongoose = require('mongoose')

const userClientSchema = mongoose.Schema({
    user_id:{type:String,required:true},
    client_doc_id:{type:String,required:true},
    scope:[{type:String}]
})

const UserClientMapping = mongoose.model('user_client_mappings',userClientSchema)

module.exports = UserClientMapping