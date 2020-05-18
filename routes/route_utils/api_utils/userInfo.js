//input cryptid and client_id
const jwt = require('jsonwebtoken')
const User = require('../../../src/config/models/user.model')

function checkClient(client_id, clientsArray) {
    let promise = new Promise((resolve, reject) => {
        let flag = clientsArray.some((client) => {
            return client.client_id === client_id
        })
        resolve(flag)
    })
    return promise
}

function userInfo(req, res, next) {
    if(!req.query.access_token){
        res.json({status:423})
    }else{
    const {
        access_token
    } = req.query

    jwt.verify(access_token.split(' ')[1], process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                res.json({
                    error: 'token_expired'
                })
            } else {
                res.json({
                    error: 'server_error'
                })
            }
        } else {
            User.findOne({
                cryptId: payload.cryptId
            }, {
                name: 1,
                email: 1,
                approved_clients: 1
            }, (err, doc) => {
                if (err) {
                    res.json({
                        error: 'server_error',
                        error_description: 'error_ocurred while processing request',
                        error_uri: process.env.ERROR_USER_INFO
                    })
                } else if (doc) {
                    let promise = checkClient(payload.client_id, doc.approved_clients)
                    promise.then(flag => {
                        if (flag) {
                            res.json({
                                    name: doc.name,
                                    email: doc.email,
                                    cryptId:payload.cryptId
                            })
                        } else {
                            res.json({
                                error: 'access_denied',
                                error_description: 'either client revoked access or client_id mentioned in request is malformed ',
                                error_uri: process.env.ERROR_USER_INFO
                            })
                        }
                    })
                } else {
                    res.json({
                        error: 'invalid_crypt_id',
                        error_description: 'crypt_id mentioned in request is either malformed or invalid',
                        error_uri: process.env.ERROR_USER_INFO
                    })
                }
            })
        }
    })
    }
}

module.exports = userInfo