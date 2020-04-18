//to validate the request parameters
//if the frontend is in react 
//the query parameters are(state,redirect_uri,client_id,scope,response_type)

const Client = require('../../../src/config/models/client.model')

function checkScope(scope, scopeArray) {
    let promise = new Promise((resolve, reject) => {
        if (scope === undefined) {
            reject('scope')
        } else {
            let flag = scope.split(',').every((ele) => {
                    if (scopeArray.includes(ele)) {
                        return true
                    } else {
                        return false
                    }
                })
                (flag) ? resolve(true) : reject('scope')
        }
    })
    return promise
}

function checkResponseType(option1, option2) {
    let promise = new Promise((resolve, reject) => {
        (option1 === option2) ? resolve(true): reject('response_type')
    })
    return promise
}


function validate(req, res, next) {

    const {
        state,
        redirect_uri,
        client_id,
        scope,
        response_type
    } = req.body.query
    if (client_id === undefined || redirect_uri === undefined) {
        res.json({
            error: 'Invalid_request',
            error_description: 'request is malformed',
            error_uri: process.env.ERROR_URI
        })
    } else {
        Client.findOne({
            client_id
        }, (err, document) => {
            if (err) {
                res.json({
                    error: 'Server_Error',
                    error_description: 'Error occured while processing this Request',
                    error_uri: process.env.ERROR_URI
                })
            } else if (document) {
                const doc = document.toObject()
                if (doc.RedirectURIs.includes(redirect_uri)) {
                    let promise1 = checkScope(scope, doc.scope)
                    let promise2 = checkResponseType(response_type, doc.response_type)
                    Promise.all([promise1, promise2])
                        .then(resArray => next())
                        .catch(errflag => {
                            if (errflag === 'scope') {
                                res.json({
                                    error: 'Invalid_Scope',
                                    error_description: 'Scope defined in Request is either Invalid or Unassigned',
                                    error_uri: process.env.ERROR_URI
                                })
                            } else {
                                res.json({
                                    error: 'Invalid_Response_Type',
                                    error_description: 'Response type mentioned in the request is invalid',
                                    error_uri: process.env.ERROR_URI
                                })
                            }
                        })
                } else {
                    res.json({
                        error: 'Invalid_Redirect_URI',
                        error_description: 'redirect_uri mentioned in request doesnot match any registered uris',
                        error_uri: process.env.ERROR_URI
                    })
                }
            } else {
                res.json({
                    error: 'Unrecognised_Client',
                    error_description: 'No Client is Registered With this Client Id',
                    error_uri: process.env.ERROR_URI
                })
            }
        })
    }
}

module.exports = validate