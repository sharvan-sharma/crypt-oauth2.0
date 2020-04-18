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
    } = req.body

    if (decision === 'allow') {
        Transaction.findOneAndDelete({
            transaction_id
        }, (err, document) => {
            if (err) {
                res.json({
                    error: 'server_error',
                    error_description: 'error encountered at server',
                    error_uri: process.env.ERROR_URI
                })
            }else{
                const {
                    client_id,
                    redirect_uri,
                    state
                } = document
                
                const newDateobj = new Date(new Date().getTime() + 600000)
                //creating an auth code
                Authorization.create({
                    client_id,
                    user: req.user._id,
                    redirect_uri,
                    used: false,
                    expiresAt: newDateobj
                }, (err, document) => {
                    if (err) {
                        res.json({
                            error: 'server_error',
                            error_description: 'error encountered at server',
                            error_uri: process.env.ERROR_URI
                        })
                    } else {
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
                                    state
                                })
                            }
                        })
                    }
                })
                //adding client to approved clients for user
                User.findOneAndUpdate({
                    _id: req.user._id
                }, {
                    '$push': {
                        'approved_clients': {
                            client_id
                        }
                    }
                })
            }
        })
    } else {
        Transaction.findOneAndDelete({
            transaction_id
        }, (err, doc) => {
            if (err) {
                res.json({
                    error: 'server_error',
                    error_description: 'error encountered at server',
                    error_uri: process.env.ERROR_URI
                })
            } else {
                res.json({
                    error: 'access_denied',
                    error_description: 'user denied the request',
                    error_uri: process.env.ERROR_URI
                })
            }
        })

    }

}
module.exports = sendAuthCode