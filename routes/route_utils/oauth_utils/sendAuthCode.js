// input -  req.body contains transaction_id , descison
// output - code(expiresin:10minutes) , state from transaction
const User = require('../../../src/config/models/user.model')
const Transaction = require('../../../src/config/models/transaction.model')
const Authorization = require('../../../src/config/models/authcodes.model')
const jwt = require('jsonwebtoken')

function sendAuthCode(req, res, next) {
    
    const {
        transaction_id,
        decision
    } = req.body.query
    if(transaction_id === undefined && decision === undefined){
        res.json({error:'parameters_missing'})
    }else if (decision === "allow") {
        Transaction.findOneAndDelete({
           _id:transaction_id
        }, (err, document) => {
            if (err) {
                res.json({
                    error: 'server_error',
                    error_description: 'error encountered at server',
                    error_uri: process.env.ERROR_URI
                })
            }else if(document){
                const {
                    client_id,
                    redirect_uri,
                    state
                } = document.toObject()
                
                const newDateobj = new Date(new Date().getTime() + 600000)
                
                let promise1 =  User.findOne({
                    _id: req.user._id
                },{approved_clients:1}).exec()
                //creating an auth code
                let promise2 = Authorization.create({
                    client_id,
                    user_id: req.user._id,
                    redirect_uri,
                    used: false,
                    expiresAt: newDateobj
                })
                
                Promise.all([promise1,promise2])
                .then(resarr=>{
                    const doc = resarr[1]
                     jwt.sign({
                            id: doc._id
                        }, process.env.AUTH_SECRET, {
                            expiresIn: 600
                        }, (err, token) => {
                            if (err) {
                                res.json({
                                    error: 'server_error',
                                    error_description: 'error encountered at server',
                                    error_uri: process.env.ERROR_URI
                                })
                            } else {
                                res.json({
                                    code: token,
                                    state,
                                    redirect_uri
                                })
                            }
                        })
                    var check = resarr[0].toObject().approved_clients.every(ele=>{
                                    if(ele.client_id !== client_id){
                                        return true
                                    }else{
                                        return false
                                    }
                                })
                    
                    if(check){
                        User.findOneAndUpdate({_id:req.user._id},{
                            '$push':{
                                'approved_clients':{
                                    client_id
                                }
                            }
                        },(err,doc)=>{
                            if(err){
                                console.log('error')
                            }
                        })
                    }
                }).catch(err=>{
                    res.json({error:'server_error',
                            error_description: 'error encountered at server',
                            error_uri: process.env.ERROR_URI})
                }) 
            }else{
                res.json({error:'paramater values doesnot exists'})
            }
        })
    } else {
        Transaction.findOneAndDelete({
            _id:transaction_id
        }, (err) => {
            if (err , doc) {
                res.json({
                    error: 'server_error',
                    error_description: 'error encountered at server',
                    error_uri: process.env.ERROR_URI
                })
            } else if(doc) {
                res.json({
                    error: 'access_denied',
                    error_description: 'user denied the request',
                    error_uri: process.env.ERROR_URI
                })
            } else{
                res.json({
                    error:'transaction doesnot exists'
                })
            }
        })

    }

}
module.exports = sendAuthCode