/*input request

{client_id,client_secret,redirect_uri,code,grant_type}

*/

const Client = require('../../../src/config/models/client.model')


function validate(req, res, next) {
    const {
        client_id,
        client_secret,
        redirect_uri,
        grant_type
    } = req.body
    if (client_id === undefined || client_secret === undefined || redirect_uri === undefined) {
        res.json({
            error: 'Invalid_Request',
            error_decription: 'Request is malformed(one or maore parameters are missing or undefined)',
            error_uri: process.env.ERROR_EXCHANGE
        })
    } else {
        Client.findOne({
            client_id,
            client_secret
        }, (err, document) => {
            if (err) {
                res.json({
                    error: 'server_error',
                    error_decription: 'Error occured while processing this request',
                    error_uri: process.env.ERROR_EXCHANGE
                })
            } else if (document) {
                if (document.RedirectURIs.includes(redirect_uri)) {
                    if (grant_type !== 'authorization_code' || grant_type === undefined) {
                        res.json({
                            error: 'invalid_grant_type',
                            error_description: 'grant_type is either undefined or invalid',
                            error_uri: process.env.ERROR_EXCHANGE
                        })
                    } else {
                        next()
                    }
                } else {
                    res.json({
                        error: 'invalid_redirect_uri',
                        error_decription: 'Redirect_uri mentioned in request is not registered',
                        error_uri: process.env.ERROR_EXCHANGE
                    })
                }
            } else {
                res.json({
                    error: 'unrecognised_client',
                    error_decription: 'client is not registered or provided wrong credentials',
                    error_uri: process.env.ERROR_EXCHANGE
                })
            }
        })
    }
}

module.exports = validate