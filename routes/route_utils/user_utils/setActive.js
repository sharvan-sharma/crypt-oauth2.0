const User = require('../../../src/config/models/user.model')
const winslog = require('../../../src/config/winston')

const setActive = (req, res, next) => {
    if (req.isAuthenticated()) {
        User.findOneAndUpdate({
            _id: req.user._id
        }, {
            '$set': {
                status: 'A'
            }
        }, {
            strict: false
        }, (err) => {
            if (err) {
                res.json({
                    error: 'server_error'
                })
            } else {
                winslog.log({
                    level: 'info',
                    message: req.user.username + " is the new login entry.total users are " + count
                });
                res.json({
                    status: 200,
                    user: req.user.username
                })
            }
        })
    } else {
        res.redirect('/login')
    }
}
module.exports = setActive