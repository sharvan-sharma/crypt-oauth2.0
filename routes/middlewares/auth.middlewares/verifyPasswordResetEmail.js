const jwt = require('jsonwebtoken')
const {winslogger} = require('../../../src/logger')

function verifyPwdResetEmail(req,res,next){
    if(req.body.token === undefined || req.body.token.length < 160){
        res.json({status:423,error_type:'invalid _token'})
    }else{
        jwt.verify(req.body.token,process.env.RESET_PWD_SECRET,(err,payload)=>{
            if(err){
                if(err.name === 'TokenExpiredError'){
                    res.json({status:422,error_type:'token_expired'})
                }else{
                    winslogger.error(`error while verifying password reset email token`)
                    res.json({status:500,error_type:'server_error'})       
                }
            }else{
                res.json({status:200,email:payload.email})
            }
        })
    }    
}

module.exports = verifyPwdResetEmail