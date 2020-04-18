function editRedirect(req,res,next){
     const {
        uri_id,
        new_uri,
        projectname
    } = req.body
    Client.findOne({
        dev_id: req.user._id,
        projectname
    }, {
        RedirectURIs: 1
    }, (err, doc) => {
        if (err) {
            res.json({
                error: 'server_error'
            })
        } else {
            let flag = doc.toObject().RedirectURIs.some(ouri => ouri.uri !== new_uri)
            if (flag) {
                client.findOneAndUpdate({
                    dev_id: req.user._id,
                    projectname
                }, {
                    '$set': {
                        'RedirectURIs.$[n].uri': new_uri
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

module.exports = editRedirect