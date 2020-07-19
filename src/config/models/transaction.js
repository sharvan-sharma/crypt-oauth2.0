const mongoose =  require('mongoose')

const transactionSchema = mongoose.Schema({
    client_id:{type:String,required:true},
    client_doc_id:{type:String,required:true},
    state:{type:String},
    code_challenge:{type:String,default:null},
    code_challenge_method:{type:String,default:null},
    scope:[{type:String}],
    redirect_uri:{type:String,required:true},
    project_id:{type:String,required:true},
    createdAt:{type:Date,expires:'5m',default:Date.now}
})

const Transactions = mongoose.model('transactions',transactionSchema)

module.exports = Transactions