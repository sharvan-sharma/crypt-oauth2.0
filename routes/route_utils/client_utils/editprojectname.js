const Client = require('../../../src/config/models/client.model')

function editProjectName(req, res, next) {
    const {
        project_id,
        new_projectname
    } = req.body
    if (project_id === undefined) {
        res.json({
            error: 'malformed request'
        })
    } else {
        Client.findOneAndUpdate({
            dev_id: req.user._id,
            _id: project_id
        }, {
            '$set': {
                projectname: new_projectname,
                client_id: project_id + '.' + new_projectname + '-' + 'crypt'
            }
        }, {
            strict: false
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
}

module.exports = editProjectName