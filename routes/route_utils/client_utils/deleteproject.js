const Client = require('../../../src/config/models/client.model')

function deleteProject(req, res, next) {
    const {
        project_id
    } = req.body
    Client.findOneAndDelete({
        _id: project_id,
        dev_id: req.user._id
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
}

module.exports = deleteProject