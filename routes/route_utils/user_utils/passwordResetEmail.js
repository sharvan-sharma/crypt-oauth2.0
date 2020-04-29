const utils = require('../../../src/utils/index')
const User = require('../../../src/config/models/user.model')

function passwordResetEmail(req, res, next) {
    User.findOne({ email: req.body.email}, {username:1,name:1,verified:1}, (err, doc) => {
        if (err) {
            res.json({
                error: 'server_error'
            })
        } else if (doc) {
            if(doc.verified){
                const user = {
                    username: doc.username,
                    name: doc.name,
                    email: req.body.email
                }
                utils.PasswordResetEmail(user, (v) => {
                    if (v === 0) {
                        res.json({
                            status: 500,
                            error: 'server_error'
                        })
                    } else {
                        res.json({
                            status: 200
                        })
                    }
                })
            }else{
                 res.json({
                        status: 423
                    })
            }
        } else {
            res.json({
                error: 'NO user exist with this registered email',
                status:422
            })
        }
    })
}

module.exports = passwordResetEmail