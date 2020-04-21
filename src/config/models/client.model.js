const mongoose = require('mongoose')

const uriSchema = mongoose.Schema({
    uri:{type:String}
})


const clientSchema = mongoose.Schema({
    dev_id:{type:String},
    projectname:{type:String,unique:true,required:true},
    client_id:{type:String},
    client_secret:{type:String},
    RedirectURIs:[uriSchema],
    OriginURIs:[uriSchema],
    scope:[{type:String}],
    response_type:{type:String},
    type:{type:String}
})

const Client = mongoose.model('clients',clientSchema)

module.exports = Client