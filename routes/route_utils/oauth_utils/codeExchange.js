//verify code and send cryptId

const jwt = require('jsonwebtoken')
const Authorization = require('../../../src/config/models/authcodes.model')
const User = require('../../../src/config/models/user.model')

function generateToken(obj,secret,expirestime){
    if(expirestime === null){//refreshtoken
        let promise = new Promise((resolve,reject)=>{
            jwt.sign(obj,secret,(err,token)=>{
                (err)?reject(err):resolve(token)
            })
        })
        return promise
    }else{//accesstoken
         let promise = new Promise((resolve,reject)=>{
            jwt.sign(obj,secret,{expiresIn:expirestime},(err,token)=>{
                (err)?reject(err):resolve(token)
            })
        })
        return promise
    }
}

function codeExchange(req,res,next){
    if(req.body.code === undefined){
        res.json({error:'parameter_missing'})
    }else{
    jwt.verify(req.body.code,process.env.AUTH_SECRET,(err,payload)=>{
        if(err){
            if(err.name === 'TokenExpiredError'){
                res.json({
                    error:'inavlid_code'
                    ,error_description:'code is either expired or undefined or malformed'
                    ,error_uri:process.env.ERROR_EXCHANGE
                })
            }else{
                res.json({
                    error:'server_error'
                    ,error_description:'error occured while processing the request'
                    ,error_uri:process.env.ERROR_EXCHANGE
                })
            }
        }else{
            Authorization.findOneAndUpdate({_id:payload.id},{'$set':{used:true}},(err,document)=>{
                if(err){
                    res.json({
                        error:'server_error'
                        ,error_description:'error occured while processing the request'
                        ,error_uri:process.env.ERROR_EXCHANGE
                    })
                }else if(document){
                    if(document.used === false){
                        User.findOne({_id:document.user_id},{cryptId:1},(err,doc)=>{
                            if(err){
                                res.json({
                                    error:'server_error'
                                    ,error_description:'error occured while processing the request'
                                    ,error_uri:process.env.ERROR_EXCHANGE
                                })
                            }else{
                                const obj = {cryptId:doc.cryptId,client_id:document.client_id}
                                let accessToken = generateToken(obj,process.env.ACCESS_TOKEN_SECRET,3600)
                                let refreshToken = generateToken(obj,process.env.REFRESH_TOKEN_SECRET,null)
                                Promise.all([accessToken,refreshToken])
                                .then(result=>{
                                    const [access_token,refresh_token] = result
                                    res.set({'Content-Type': 'application/json',
                                             'Cache-Control': 'no-store',
                                              'Pragma': 'no-cache'})
                                    res.json({
                                            access_token:"bearer "+access_token,
                                            token_type:"bearer",
                                            expires_in:'1h',
                                            refresh_token
                                    })
                                })
                                .catch(err=>{
                                     res.json({
                                        error:'server_error'
                                        ,error_description:'error occured while processing the request'
                                        ,error_uri:process.env.ERROR_EXCHANGE
                                    })
                                })
                            }
                        })
                    }else{
                        res.json({
                            error:'already_used_code'
                            ,error_description:'code has been already used'
                            ,error_uri:process.env.ERROR_EXCHANGE
                        })
                    }
                }else {
                     res.json({
                        error:'code_expired'
                        ,error_description:'error occured while processing the request'
                        ,error_uri:process.env.ERROR_EXCHANGE
                    })
                }
            })
        }
    })
}
}

module.exports = codeExchange