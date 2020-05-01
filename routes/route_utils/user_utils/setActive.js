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
            console.log(doc)
            if (err) {
                res.json({
                    error: 'server_error',status:500
                })
            } else if(doc) {
                winslog.log({
                    level: 'info',
                    message: req.user.username + " is the new login entry.total users are "
                });
                res.json({
                    status: 200,
                    username: doc.username,
                    email:doc.email,
                    name:doc.name,
                    logged_in:true,
                    transaction_id:doc.transaction_id
                })
            }else{
                res.json({error:'no user exists',status:401})
            }
        })
    } else {
        res.redirect('/login')
    }
}
module.exports = setActive