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
        }, (err,doc) => {
            if (err) {
                res.json({
                    error: 'server_error'
                })
            } else if(doc) {
                winslog.log({
                    level: 'info',
                    message: req.user.username + " is the new login entry.total users are "
                });
                res.json({
                    status: 200,
                    user: req.user.username,
                    transaction_id:doc.toObject().transaction_id
                })
            }else{
                res.json({error:'no user exists'})
            }
        })
    } else {
        res.redirect('/login')
    }
}
module.exports = setActive