const mongoose =  require('mongoose')

const transactionSchema = mongoose.Schema({
    client_id:{type:String},
    state:{type:String},
    redirect_uri:{type:String},
    created_at:{type:Date}
})

const Transaction = mongoose.model('transactions',transactionSchema)

module.exports = Transaction
