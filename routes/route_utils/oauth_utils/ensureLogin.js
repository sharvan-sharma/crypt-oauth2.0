// to check whether the user is already logged in
// if logged in
//      then render the decison Page
// else
//      redirect to login first
const Transaction = require('../../../src/config/models/transaction.model')

function ensurelogin(req, res, next) {
    Transaction.create({
        client_id: req.body.query.client_id,
        redirect_uri: req.body.query.redirect_uri,
        state: req.body.query.state || '',
        created_at:new Date()
    }, (err, doc) => {
    if(err){
        res.json({error:'server_error',status:500})
    }else{
        if (req.isAuthenticated()) {
            res.json({
                logged_in:true,
                transaction_id: doc._id,
                status:200,
            })
        } else {
            res.json({
                status:200,
                logged_in:false,
                transaction_id: doc._id
            })
        }
    }
    })
}

module.exports = ensurelogin