
const { Users } = require('../../../src/config/models')
const { sendEmail } = require('../../../src/utils/mail')
const { passwordResetEmailTemplate } = require('../../../src/utils/mail/templates')
const jwt = require('jsonwebtoken')
const { isEmail } = require('../../../src/utils/validations')
const { maillogger,winslogger } = require('../../../src/logger')


function passwordResetEmail(req, res, next) {

    if(req.body.email === undefined || !isEmail(req.body.email)){
        res.json({status:423,error_type:'email'})
    }else {
        Users.findOne({email: req.body.email}, {name:1,verified:1,status:1}, (err, user) => {
            if (err) {
                res.json({error_type: 'server_error',status:500})
            } else if (user) {
                if(user.verified){
                    if(user.status === 'A'){
                        jwt.sign({email:req.body.email},process.env.RESET_PWD_SECRET,{expiresIn:600},(err,token)=>{
                                if(err){
                                    res.json({status:500,error_type:'token_server_error'})
                                    winslogger.error(`user - ${user.username} reset password email token generation error`)
                                }
                                else{
                                    let promise = sendEmail(passwordResetEmailTemplate(req.body.email,user.name,token))
                                    promise.then(result=>{
                                        res.json({status:200,msg:'mail sent'})
                                        maillogger.info(`user - ${user.username} reset password email sent`)
                                    })
                                    .catch(err=>{
                                        res.json({status:500,type:'mail_server_error'})
                                        maillogger.error(`user - ${user.username} reset password email error`)
                                    })
                                }
                            })
                    }else{res.json({status: 455,error_type:'inactive'})}
                }else{res.json({status: 422,error_type:'verified'})}
            } else {res.json({error_type:'user_doesnot_exist',status:401})}
        })
    }
}

module.exports = passwordResetEmail