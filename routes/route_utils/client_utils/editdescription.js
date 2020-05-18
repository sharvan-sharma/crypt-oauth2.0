const Client = require('../../../src/config/models/client.model')

function editdescription(req, res, next) {
    if (!req.body.project_id) {
        res.json({
            status: 423
        })
    } else {
        Client.findOneAndUpdate({
            dev_id: req.user._id,
            _id: req.body.project_id
        }, {
            '$set': {
                description: req.body.new_description || ''
            }
        }, {
            strict: false,
            new: true
        }, (err, doc) => {
            if (err) {
                res.json({
                    status: 500
                })
            } else {
                res.json({
                    status: 200,
                    description: doc.description
                })
            }
        })
    }
}

module.exports = editdescription