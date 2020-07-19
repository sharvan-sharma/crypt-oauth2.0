const  {Users} = require('../../../src/config/models')
const  jwt = require('jsonwebtoken')
const  {winslogger, maillogger} = require('../../../src/logger')
const  {sendEmail} = require('../../../src/utils/mail')
const  {verifyEmailTemplate} = require('../../../src/utils/mail/templates')


module.exports = (req,res,next) => {
    
    const {name,username,email,password} = req.body

    Users.register({
        name,
        username,
        email,
    },password
    ,(err,user)=>{
        if(err){
            if(err.name === 'UserExistsError'){
                res.json({status:422,error_type:'userAlreadyExist'})
            }else{
                res.json({status:500,error_type:'server_register'})
                winslogger.error(`user - server error while registering user`)
            }
        }else{
            jwt.sign({ password,username,id:user._id },process.env.EMAIL_VERIFY_SECRET,{expiresIn:3600},(err,token) => {
                if(err){
                    res.json({status:500,error_type:'server_token'})
                    winslogger.error('user - jwt error while generating token')
                }else{
                    res.json({status:200,type:'mail_sent'})
                    let promise = sendEmail(verifyEmailTemplate(email,name,token))
                    promise.then(()=>{
                        maillogger.info(`user sucessfully sent verification email to ${email}`)
                    })
                    .catch((err)=>{
                        maillogger.error(`user error while sending verification email to ${email}`)
                    })
                }
            })
        }
    })

}