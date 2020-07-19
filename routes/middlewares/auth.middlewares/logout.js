const {Users} = require('../../../src/config/models')
const {winslogger} = require('../../../src/logger')

module.exports = (req,res,next) => {
    if(req.isAuthenticated()){
        Users.findOneAndUpdate({_id:req.user._id},{
            $set:{
                login_status:'IA'
            }
        },
        {new:true},
        (err)=>{
            if(err){
                res.json({status:500,error_type:'server_error'})
                winslogger.error(`user - error while logging out user ${req.user.username}`)
            }else{
                req.logout()
                res.json({status:200,logged_in:false})
            }
        })
    }else{
        res.json({status:401,error_type:'unauthorised'})
    }
}