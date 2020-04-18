const Client = require('../../../src/config/models/client.model')

const generateSecret = (secretLength, cb) => {
    const charstring = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890'
    let secret = ''
    for (let i = 0; i < secretLength; i++) {
        secret = secret + charstring[Math.floor(Math.random() * charstring.length)]
        if (i === secretLength - 1) {
            cb(secret)
        }
    }
}

const generator = (clientdocid, appname, cb) => {
    const ClientID = clientdocid + '.' + appname + '-' + 'crypt'
    generateSecret(24, (ClientSecret) => {
        cb(ClientID, ClientSecret)
    })
}

function generateCredentials(req, res, next) {
    Client.findOne({
        dev_id: req.user._id,
        projectname: req.body.projectname
    }, (err, doc) => {
        if (err) {
            res.json({
                error: 'server_error'
            })
        } else {
            const document = doc.toObject()
            if (document.OriginURIs === undefined || document.RedirectURIs === undefined) {
                res.json({
                    error: 'uris are not specified'
                })
            } else if (document.OriginURIs.length === 0 || document.RedirectURIs.length === 0) {
                res.json({
                    error: 'uris are not specified'
                })
            } else {
                generator(document._id, document.projectname, (client_id, client_secret) => {
                    Client.findOneAndUpdate({
                        dev_id: req.user._id,
                        projectname: document.projectname
                    }, {
                        '$set': {
                            client_id,
                            client_secret
                        }
                    }, (err) => {
                        if (err) {
                            res.json({
                                error: 'server_error'
                            })
                        } else {
                            res.json({
                                status: 200
                            })
                        }
                    })
                })
            }
        }
    })
}

module.exports = generateCredentials