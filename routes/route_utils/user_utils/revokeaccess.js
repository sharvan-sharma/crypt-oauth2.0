const User = require('../../../src/config/models/user.model')

const RevokeAccess = (req,res,next)=>{
    if(req.isAuthenticated()){
        User.findOneAndUpdate({_id:req.user._id},
            {'$pull':{
                'approved_clients':{$elematch:{'client_id':client_id}}
            }
        },(err)=>{
            if(err){
                res.json({error:'server_error',status:500})
            }else{
                res.json({status:200})
            }
        })        
    }else{
        res.redirect('/')
    }
}

module.exports = RevokeAccess