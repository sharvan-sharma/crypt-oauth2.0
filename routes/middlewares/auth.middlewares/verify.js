const jwt = require('jsonwebtoken')
const { Users } = require('../../../src/config/models')
const { winslogger } = require('../../../src/logger')

const verify = async (req,res,next) => {

    if(req.isAuthenticated()){
        res.json({status:422,error_type:'already verified'})
    }else{

    jwt.verify(req.body.token,process.env.EMAIL_VERIFY_SECRET,async (err,payload)=>{
        if(err){
            if(err.name === 'TokenExpiredError'){
                res.json({status:455,error_type:'token_expires'})
            }else{
                res.json({status:500,error_type:'server_error'})
                winslogger.error(`user - error while extracting payload out of token.`)
            }
        }else{
            try{
                const  user = await Users.findById(payload.id)
                if(user.verified && user.cryptId !== null ){
                    req.body.username = payload.username
                    req.body.password = payload.password
                    next()
                }else{
                    Users.findOneAndUpdate({_id:payload.id},{
                            $set:{
                                status:'A',
                                verified:true,
                                cryptId:payload.id+'.user-crypt'
                            }
                        },{new:true},(err)=>{
                            if(err){
                                res.json({status:500,error_type:'server_error'})
                                winslogger.error(`user - error occur while adding cryptid and changing status of user ${payload.username}`)
                            }else{
                                req.body.username = payload.username
                                req.body.password = payload.password
                                next()
                            }
                        })
                }

            }catch{
                res.json({status:500,error_type:'server'})
                winslogger.error(`user - error while extracting user for checking verified`)
            } 
        }
    })
    }
}

module.exports  = verify