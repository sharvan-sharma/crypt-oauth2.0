const User = require('../../../src/config/models/user.model')

function checkEmail(req, res, next) {

    if (req.body.email === undefined) {
        res.json({
            status:301,
            error: 'missing_parameters'
        })
    } else {
        User.exists({
           email:req.body.email
        }, (err, flag) => {
            if (err) {
                res.json({
                    status: 500,
                    error: 'server_error'
                })
            } else if (flag) {
                res.json({
                    status: 422,
                    error: 'user already Register with this email'
                })
            } else {
                res.json({
                    status: 200
                })
            }
        })
    }

}

module.exports = checkEmail