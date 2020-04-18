const User = require('../../../src/config/models/user.model')

function checkUserName(req, res, next) {

    if (req.body.username === undefined) {
        res.json({
            error: 'missing_parameters'
        })
    } else {
        User.exists({
            username
        }, (err, flag) => {
            if (err) {
                res.json({
                    status: 500,
                    error: 'server_error'
                })
            } else if (flag) {
                res.json({
                    status: 422,
                    error: 'username already exists'
                })
            } else {
                res.json({
                    status: 200
                })
            }
        })
    }

}

module.exports = checkUserName