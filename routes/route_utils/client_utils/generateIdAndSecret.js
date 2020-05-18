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

const generator = (clientdocid, type, cb) => {
    const ClientID = clientdocid + '.clientapplication-'+type+'-crypt'
    generateSecret(24, (ClientSecret) => {
        cb(ClientID, ClientSecret)
    })
}

function generateCredentials(req, res, next) {
    if(!req.body.project_id){
        res.json({status:423})
    }else{
    Client.findOne({
        dev_id: req.user._id,
        _id: req.body.project_id
    }, (err, doc) => {
        if (err) {
            res.json({
                error: 'server_error',status:500
            })
        } else if(doc) {
            const document = doc.toObject()
            if (document.OriginURIs === undefined || document.RedirectURIs === undefined) {
                res.json({
                    error: 'uris are not specified',status:422
                })
            } else if (document.OriginURIs.length === 0 || document.RedirectURIs.length === 0) {
                res.json({
                    error: 'uris are not specified',status:422
                })
            } else {
                generator(document._id,document.type, (client_id, client_secret) => {
                    Client.findOneAndUpdate({
                        dev_id: req.user._id,
                        projectname: document.projectname
                    }, {
                        '$set': {
                            client_id,
                            client_secret
                        }
                    },{strict:false}, (err,clientdoc) => {
                        if (err) {
                            res.json({
                                error: 'server_error',status:500
                            })
                        } else if(clientdoc){
                            res.json({
                                status: 200,
                                client_id,
                                client_secret,
                                created_at:document.created_at
                            })
                        }else{
                            res.json({error:'client doesnot exists',status:401})
                        }
                    })
                })
            }
        }else{
            res.json({error:'client doesnot exits for this dev'})
        }
    })
}
}

module.exports = generateCredentials