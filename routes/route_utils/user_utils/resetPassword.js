const User = require('../../../src/config/models/user.model')

function ResetPassword(req, res, next) {
    if (!req.body.username || !req.body.new_password) {
        res.json({
            status: 423
        })
    } else {

        const {
            username,
            new_password
        } = req.body
        User.findOne({
                username
            })
            .then((user) => {
                user.setPassword(new_password, (err, u) => {
                    if (err) {
                        res.json({
                            status: 500
                        })
                    } else {
                        u.save(() => {
                            req.body.password = new_password
                            next()
                        })
                    }
                })
            }).catch(err => {
                res.json({
                    status: 500
                })
            })
    }

}

module.exports = ResetPassword