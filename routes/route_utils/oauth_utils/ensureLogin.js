// to check whether the user is already logged in
// if logged in
//      then render the decison Page
// else
//      redirect to login first
const Transaction = require('../../../src/config/models/transaction.model')

function ensurelogin(req, res, next) {
    Transaction.create({
        client_id: req.query.client_id,
        redirect_uri: req.query.redirect_uri,
        state: req.query.state
    }, (err, doc) => {
        if (req.isAuthenticated()) {
            res.json({
                logged_in:true,
                transaction_id: doc._id
            })
        } else {
            res.json({
                logged_in:false,
                transaction_id: doc._id
            })
        }
    })
}

module.exports = ensurelogin