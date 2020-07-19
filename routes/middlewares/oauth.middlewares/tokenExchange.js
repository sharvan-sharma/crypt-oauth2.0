const jwt = require('jsonwebtoken')

const { Users } = require('../../../src/config/models')

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


const tokenExchange = (req,res,next) => {

        const obj = {user_id:req.body.auth_code.user_id,client_doc_id:req.body.form._id}
        let accessToken = generateToken(obj,process.env.ACCESS_TOKEN_SECRET,3600)
        let refreshToken = generateToken(obj,process.env.REFRESH_TOKEN_SECRET,null)

        Promise.all([accessToken,refreshToken])
                .then(result=>{
                     [access_token,refresh_token] = result
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
                            ,error_uri:process.env.ERROR_URI
                        })
                })
}

module.exports = tokenExchange