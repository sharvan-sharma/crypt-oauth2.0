
const jwt = require('jsonwebtoken')

function refreshaccesstoken(req,res,next){
    if(req.body.refresh_token === undefined || req.body.refresh_token.length < 160){
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
                jwt.sign({user_id:payload.user_id,client_doc_id:payload.client_doc_id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:3600},(err,token)=>{
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