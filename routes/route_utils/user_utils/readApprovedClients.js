const User = require('../../../src/config/models/user.model')
const Client = require('../../../src/config/models/client.model')

function readApprovedClients(req, res, next) {
    if (req.isAuthenticated()) {
        User.findOne({
            _id: req.user._id
        }, {
            approved_clients: 1
        }, (err, doc) => {
            if (err) {
                res.json({
                    status: 500
                })
            } else if (doc) {
                const array = doc.approved_clients.map(app => app.client_id)
                Client.find({
                    client_id: {
                        $in: array
                    }
                }, {
                    projectname: 1,
                    client_id: 1,
                    _id: 0
                }, (err, docarray) => {
                    if (err) {
                        res.json(err)
                    } else if (docarray) {
                        res.json({
                            status: 200,
                            array: docarray
                        })
                    } else {
                        res.json({
                            status: 200,
                            array: []
                        })
                    }
                })
            } else {
                res.json({
                    status: 401
                })
            }
        })
    } else {
        res.json({
            status: 401
        })
    }
}

module.exports = readApprovedClients