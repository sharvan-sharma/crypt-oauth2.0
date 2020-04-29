const User = require('../../../src/config/models/user.model')

function readApprovedClients(req,res,next){
    User.findOne({_id:req.user._id},{approved_clients:1},(err,doc)=>{
        if(err){
            res.json({status:500})
        }else if(doc){
            res.json({
                status:200,
                array:doc.approved_clients
            })
        }else{
            res.json({status:401})
        }
    })
}

module.exports = readApprovedClients