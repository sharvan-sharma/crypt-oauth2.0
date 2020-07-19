const {Users} = require('../../../src/config/models')
const { winslogger } = require('../../../src/logger')

module.exports = (req,res,next) =>{
    if(req.isAuthenticated()){
        if(req.user.verified){
            if(req.user.status === 'A'){
                Users.findOneAndUpdate(
                {_id:req.user._id}
                ,{
                    $set:{
                        login_status : 'A'
                    }
                },
                {new:true},
                (err)=>{
                    if(err){
                        res.json({status:500,error_type:'server set active'})
                        winslogger.error(`user - error while settingg user login_status active ${req.user.username}`)
                    }else{
                        res.json({
                            status:200,
                            logged_in:true,
                            email:req.user.email,
                            username:req.user.username,
                            createdAt:req.user.createdAt,
                            photo:req.user.photo
                        })
                    }
                })
            }else{
                res.json({status:455,error_type:'statusSetToIA'})
            }
        }else{
            res.json({status:422,error_type:'userNotVerified'})
        }
    }else{
        res.json({status:401,error_type:'unauthorised'})
    }
}