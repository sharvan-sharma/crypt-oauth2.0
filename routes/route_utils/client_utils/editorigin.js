// get uri_id newuri projectname

const Client = require('../../../src/config/models/client.model')

function editOrigin(req, res, next) {
    const {
        uri_id,
        new_uri,
        projectname
    } = req.body
    Client.findOne({
        dev_id: req.user._id,
        projectname
    }, {
        OriginURIs: 1
    }, (err, doc) => {
        if (err) {
            res.json({
                error: 'server_error'
            })
        } else {
            let flag = doc.toObject().OriginURIs.some(ouri => ouri.uri !== new_uri)
            if (flag) {
                client.findOneAndUpdate({
                    dev_id: req.user._id,
                    projectname
                }, {
                    '$set': {
                        'OriginURIs.$[n].uri': new_uri
                    }
                }, {
                    arrayFilters: [{
                        'n._id': {
                            $eq: uri_id
                        }
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
        }
    })
}

module.exports = editOrigin