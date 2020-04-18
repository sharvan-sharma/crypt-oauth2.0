//input cryptid and client_id

const User = require('../../../src/config/models/user.model')
const Client = require('../../../src/config/models/client.model')

function checkClient(client_id, clients_Array) {
    let promise = new Promise((resolve, reject) => {
        let flag = clientsArray.some((client) => {
                return client.client_id === client_id
            })
            (flag) ? resolve(true) : resolve(false)
    })
    return promise
}

function userInfo(req, res, next) {
    const {
        cryptID,
        client_id
    } = req.body
    if (cryptID === undefined || client_id === undefined) {
        res.json({
            error: 'malformed_request',
            error_description: 'some parmeters are missing',
            error_uri: process.env.ERROR_USER_INFO
        })
    } else {
        Client.exists({
            client_id
        }, (err, bool) => {
            if (err) {
                res.json({
                    error: 'server_error'
                })
            } else if (bool) {
                User.findOne({
                    cryptID
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
                        let promise = checkClient(client_id, doc.approved_clients)
                        promise.then(flag => {
                            if (flag) {
                                res.json({
                                    profile: {
                                        name: doc.name,
                                        email: doc.email
                                    }
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
            } else {
                res.json({
                    error: 'client doesnot exist'
                })
            }
        })
    }

}

module.exports = userInfo