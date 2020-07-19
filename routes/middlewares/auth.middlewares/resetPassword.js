const { Users } = require('../../../src/config/models')
const { isEmail } = require('../../../src/utils/validations')
const { winslogger } = require('../../../src/logger')

async function resetPassword(req,res,next){
    if(req.body.password === undefined || req.body.password.length < 8 || req.body.password.length > 25){
        return res.json({status:423,error_type:'password'})}
    else if(!req.body.email === undefined || !isEmail(req.body.email)){
        return res.json({status:423,error_type:'email'})
    }else{
        const {email,password} = req.body
        Users.findOne({email})
       .then((user)=>{
            user.setPassword(password,(err,u)=>{
                if(err){
                    res.json({status:500,error_type:'server_error'})
                    winslogger.error(`user - ${user.username} error while reseting password`)
                }else{
                    u.save(()=>{
                        winslogger.info(`user - ${user.username} successfully reset password`)
                        req.body.username = user.username
                        next()
                    }) 
                }
            })
        }).catch(err=>{
            winslogger.error(`user - ${user.username} error while reseting password catch block`)
            res.json({status:500,error_type:'server_error'})
        })
    }
}

module.exports = resetPassword