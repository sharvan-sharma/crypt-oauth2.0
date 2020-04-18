const mongoose = require('mongoose')

const uriSchema = mongoose.Schema({
    uri:{type:String,unique:true}
})


const clientSchema = mongoose.Schema({
    dev_id:{type:String},
    projectname:{type:String,unique:true,required:true},
    client_id:{type:String,unique:true},
    client_secret:{type:String},
    RedirectURIs:[uriSchema],
    OriginURIs:[uriSchema],
    scope:[{type:String}],
    response_type:{type:String}
})

const Client = mongoose.model('clients',clientSchema)

module.exports = Client