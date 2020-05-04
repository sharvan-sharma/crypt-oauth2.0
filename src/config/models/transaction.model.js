const mongoose =  require('mongoose')

const transactionSchema = mongoose.Schema({
    client_id:{type:String},
    state:{type:String},
    redirect_uri:{type:String},
    createdAt:{type:Date,expires:'5m',default:Date.now}
})

const Transaction = mongoose.model('transactions',transactionSchema)

module.exports = Transaction
