//verify code and send cryptId

const jwt = require('jsonwebtoken')
const Authorization = require('../../../src/config/models/authcodes.model')
const User = require('../../../src/config/models/user.model')

function codeExchange(req,res,next){
    if(req.body.query.code === undefined){
        res.json({error:'parameter_missing'})
    }else{
    jwt.verify(req.body.query.code,process.env.AUTH_SECRET,(err,payload)=>{
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
                }else{
                    if(document.used === false){
                        User.findOne({_id:document.user_id},{cryptId:1},(err,doc)=>{
                            if(err){
                                res.json({
                                    error:'server_error'
                                    ,error_description:'error occured while processing the request'
                                    ,error_uri:process.env.ERROR_EXCHANGE
                                })
                            }else{
                                res.json({cryptId:doc.cryptId})
                            }
                        })
                    }else{
                        res.json({
                            error:'already_used_code'
                            ,error_description:'code has been already used'
                            ,error_uri:process.env.ERROR_EXCHANGE
                        })
                    }
                }
            })
        }
    })
}
}

module.exports = codeExchange