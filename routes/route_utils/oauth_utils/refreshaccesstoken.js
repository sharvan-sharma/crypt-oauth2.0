
const jwt = require('jsonwebtoken')

function refreshaccesstoken(req,res,next){
    if(!req.body.refresh_token){
        res.json({
            error:'malformed_request',
            error_description:'parameters are malformed or missing'
        })
    }else{
        jwt.verify(req.body.refresh_token,process.env.REFRESH_TOKEN_SECRET,(err,payload)=>{
            if(err){
                res.json({
                    error:'invalid_token or server_error'
                })
            }else{
                jwt.sign({cryptId:payload.cryptId},process.env.ACCESS_TOKEN_SECRET,{expiresIn:3600},(err,token)=>{
                    if(err){
                        res.json({
                            error:'server_error',
                            error_description:'error occured while processing request'
                        })
                    }else{
                        res.json({
                            access_token:"bearer "+token,
                            token_type:'bearer',
                            expiresIn:'1h'
                        })
                    }
                })
            }
        })
    }
}

module.exports = refreshaccesstoken