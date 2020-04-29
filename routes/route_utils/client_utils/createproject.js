// projectname type:ssa(serverside application)
// scope:[profile]
// response_type:code
//create document in clients collection set app name to projectname,scope,response_type
// add this aappdocID to users table

const Client = require('../../../src/config/models/client.model')
const User = require('../../../src/config/models/user.model')

function createProject(req, res, next) {
    const {
        type,
        projectname,
        redirect_uri,
        origin_uri
    } = req.body
    if (type === undefined || projectname === undefined || projectname.length <= 3) {
        res.json({
            error: 'validation'
        })
    } else {
        if (type === 'ssa') {
            var scope = ['profile']
            var response_type = 'code'
        }
        Client.findOne({
            dev_id: req.user._id,
            projectname
        }, {
            projectname: 1
        }, (err, doc) => {
            if (err) {
                res.json({
                    error: 'server_error',status:500
                })
            } else if (doc) {
                res.json({
                    error: 'app with the name allready exists',status:422
                })
            } else {
                Client.create({
                    dev_id: req.user._id,
                    projectname,
                    response_type,
                    scope,
                    RedirectURIs:[{uri:redirect_uri}],
                    OriginURIs:[{uri:origin_uri}],
                    type,
                    created_at:new Date()
                }, (err, clientdoc) => {
                    if (err) {
                        res.json({
                            error: 'server_error',status:500
                        })
                    } else {
                        User.findOneAndUpdate({
                            _id: req.user._id
                        }, {
                            '$push': {
                                apps: {
                                    appdocID: clientdoc._id
                                }
                            }
                        }, (err) => {
                            if (err) {
                                res.json({
                                    error: 'server_error',status:500
                                })
                            } else {
                                res.json({
                                    status: 200,
                                    id:clientdoc._id
                                })
                            }
                        })
                    }
                })
            }
        })
    }
}

module.exports = createProject