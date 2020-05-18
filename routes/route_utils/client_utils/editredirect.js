// get uri_id newuri projectname

const Client = require('../../../src/config/models/client.model')

const checkuri = (uri,uriarray)=>{
    let promise = new Promise(resolve=>{
        let flag = uriarray.every(ori=>{
            if(ori.uri !== uri){
                return true
            }else{
                return false
            }
        })
        resolve(flag)
    })
    return promise
}

function editRedirect(req, res, next) {
     if (!req.body.uri_id || !req.body.new_uri || !req.body.project_id) {
        res.json({
            status: 423
        })
    } else {
    const {
        uri_id,
        new_uri,
        project_id
    } = req.body
    Client.findOne({
        dev_id: req.user._id,
        _id:project_id
    }, {
        RedirectURIs: 1
    }, (err, doc) => {
        if (err) {
            res.json({
                error: 'server_error',status:500
            })
        } else if(doc) {
            let promise = checkuri(new_uri,doc.toObject().RedirectURIs)
            promise.then(flag=>{
            if (flag) {
                Client.findOneAndUpdate({
                    dev_id: req.user._id,
                    _id:project_id
                }, {
                    '$set': {
                        'RedirectURIs.$[n].uri': new_uri
                    }
                }, {
                    arrayFilters: [{
                        'n._id':  uri_id
                    }],
                    strict: false,
                    new: true
                }, (err, document) => {
                    if (err) {
                        res.json({
                            error: 'server_error',status:500
                        })
                    } else if(document) {
                        res.json({
                            status: 200,RedirectURIs:document.RedirectURIs
                        })
                    }else{
                        res.json({error:'parameter values donot exists'})
                    }
                })
            } else {
                res.json({
                    error: 'uri already exists'
                    ,status:422
                })
            }
           })
        }else{
            res.json({error:'client_doesnot_exists',status:401})
        }
    })
}
}

module.exports = editRedirect