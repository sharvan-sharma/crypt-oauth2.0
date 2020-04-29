const Client = require('../../../src/config/models/client.model')

function editProjectName(req, res, next) {
    const {
        project_id,
        new_projectname
    } = req.body
    if (project_id === undefined) {
        res.json({
            error: 'malformed request',status:500
        })
    } else {
        Client.findOneAndUpdate({
            dev_id: req.user._id,
            _id: project_id
        }, {
            '$set': {
                projectname: new_projectname,
            }
        }, {new:true,
            strict: false
        }, (err,doc) => {
            if (err) {
                res.json({
                    error: 'server_error',status:500
                })
            } else {
                res.json({
                    status: 200,
                    name:doc.projectname
                })
            }
        })
    }
}

module.exports = editProjectName