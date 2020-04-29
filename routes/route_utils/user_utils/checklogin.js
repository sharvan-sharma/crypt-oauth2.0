const User = require('../../../src/config/models/user.model')

const checklogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        User.findOne({_id:req.user._id},{email:1,username:1,name:1,transaction_id:1},(err,doc)=>{
            if(err){
                res.json({status:500,error:'server_error'})
            }else if(doc){
                res.json({
                    logged_in: true,
                    name: doc.name,
                    username: doc.username,
                    email: doc.email,
                    transaction_id:doc.transaction_id,
                })
            }else{
                res.json({status:401,error:'doesnot exists'})
            }
        })
    } else {
        res.json({
            logged_in: false
        })
    }
}

module.exports = checklogin