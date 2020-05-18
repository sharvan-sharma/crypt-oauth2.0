const Client = require('../../../src/config/models/client.model')

function edithomepage(req, res, next) {
    if (!req.body.project_id || !req.body.new_link) {
        res.json({
            status: 423
        })
    } else {

        Client.findOneAndUpdate({
            dev_id: req.user._id,
            _id: req.body.project_id
        }, {
            '$set': {
                homepagelink: req.body.new_link
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
                    homepagelink: doc.homepagelink
                })
            }
        })
    }
}

module.exports = edithomepage