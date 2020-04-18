const mongoose = require('mongoose')

const stateSchema = mongoose.Schema({
    client_id:{type:String},
    user_id:{type:String},
    redirect_uri:{type:String},
    state:{type:String},
})

const State = mongoose.model('states',stateSchema)

module.exports = State