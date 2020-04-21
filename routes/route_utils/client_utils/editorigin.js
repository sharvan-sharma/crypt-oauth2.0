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

function editOrigin(req, res, next) {
    const {
        uri_id,
        new_uri,
        project_id
    } = req.body
    Client.findOne({
        dev_id: req.user._id,
        _id:project_id
    }, {
        OriginURIs: 1
    }, (err, doc) => {
        if (err) {
            res.json({
                error: 'server_error'
            })
        } else if(doc) {
            let promise = checkuri(new_uri,doc.toObject().OriginURIs)
            promise.then(flag=>{
            if (flag) {
                Client.findOneAndUpdate({
                    dev_id: req.user._id,
                    _id:project_id
                }, {
                    '$set': {
                        'OriginURIs.$[n].uri': new_uri
                    }
                }, {
                    arrayFilters: [{
                        'n._id':  uri_id
                    }],
                    strict: false,
                    new: true
                }, (err, documnet) => {
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
            } else {
                res.json({
                    error: 'uri already exists'
                })
            }
           })
        }else{
            res.json({error:'client_doesnot_exists'})
        }
    })
}

module.exports = editOrigin