const  { Forms, AuthCodes} = require('../../../src/config/models')
const crypto = require('crypto')
const {isUrl} = require('../../../src/utils/validations')
const jwt = require('jsonwebtoken')

const clientIdMWcEx = (req,res,next) => {
    const {client_id} = req.body

    Forms.findOne({client_id}, (err, form) => {
            if (err) {
                res.json({
                    status:500,
                    error: 'Server_Error',
                    error_description: 'Error occured while processing this Request',
                    error_uri: process.env.ERROR_URI
                })
            } else if (form){
                req.body.form = form.toObject()
                next()
            }else{
                res.json({
                    status:401,
                    error: 'Unrecognised_Client',
                    error_description: 'No Client is Registered With this Client Id',
                    error_uri: process.env.ERROR_URI
                })
            }
    })
}

const redirectUriMWcEx = (req,res,next)=>{
    const {redirect_uri} = req.body

    if(redirect_uri === undefined || !isUrl(redirect_uri)){
        res.json({
            status:401,
            error: 'Invalid_Redirect_URI',
            error_description: 'redirect_uri mentioned in request is invalid',
            error_uri: process.env.ERROR_URI
        })
    }else{
        const exist =  req.body.form.redirect_uris.some(ele => ele.uri === redirect_uri)
        if(exist) next()
        else{
            res.json({
                status:401,
                error: 'Invalid_Redirect_URI',
                error_description: 'redirect_uri mentioned in request doesnot match any registered uris',
                error_uri: process.env.ERROR_URI
            })
        }
    }    
}

const secretMWcEX = (req,res,next)=>{
    const req_client_secret = req.body.client_secret
    const {client_type,client_secret} = req.body.form

    if(client_type === 'ssa'){
        if(req_client_secret === undefined || req_client_secret !== client_secret){
            res.json({
                    error: 'unrecognised_client',
                    error_decription: 'client is not registered or provided wrong credentials',
                    error_uri: process.env.ERROR_URI
            })
        }else{
            next()
        }
    }else{
        next()
    }
}

const grantTypeMWcEX = (req,res,next) => {
    const {grant_type} = req.body
    if(grant_type === undefined || grant_type !== 'authorization_code'){
         res.json({
                error: 'invalid_grant_type',
                error_description: 'grant_type is either undefined or invalid',
                error_uri: process.env.ERROR_URI
            })
    }else next()
}

const codeMWcEX = (req,res,next) => {
    const {code} = req.body

    if(code === undefined || code.length < 160){
        res.json({status:423,error:'code_parameter_missing'})
    }else{
        jwt.verify(req.body.code,process.env.AUTH_SECRET,(err,payload)=>{
        if(err){
            if(err.name === 'TokenExpiredError'){
                res.json({
                    error:'inavlid_code'
                    ,error_description:'code is either expired or undefined or malformed'
                    ,error_uri:process.env.ERROR_URI
                })
            }else{
                res.json({
                    error:'server_error'
                    ,error_description:'error occured while processing the request'
                    ,error_uri:process.env.ERROR_URI
                })
            }
        }else{
            AuthCodes.findOneAndUpdate({_id:payload.id},{'$set':{used:true}},(err,auth_code)=>{
                if(err){
                    res.json({
                        error:'server_error'
                        ,error_description:'error occured while processing the request'
                        ,error_uri:process.env.ERROR_URI
                    })
                }else if(auth_code){
                    if(auth_code.used === false){
                        req.body.auth_code = auth_code
                        next()
                    }else{
                        res.json({
                            error:'already_used_code'
                            ,error_description:'code has been already used'
                            ,error_uri:process.env.ERROR_URI
                        })
                    }
                }else{
                    res.json({
                        error:'code_expired'
                        ,error_description:'error occured while processing the request'
                        ,error_uri:process.env.ERROR_URI
                    })
                }
            })
        }
        })
    }
}

const codeChallengeMWcEx = (req,res,next) => {
    const {auth_code} = req.body
    if(auth_code.code_challenge !== null){
        const {code_verifier} = req.body
        if(code_verifier === undefined){
            res.json({
                status:423,
                error_type:'code_verifier_undefined'
            })
        }else{
            if(auth_code.code_challenge_method === 'plain'){
                if(code_verifier !== auth_code.code_challenge){
                    res.json({status:423,error_type:'code_verifier_invalid'})
                }else{
                    next()
                }
            }else{
                const hash = crypto.createHash('sha256').update(code_verifier).digest('base64');
                if(hash !== auth_code.code_challenge){
                    res.json({status:423,error_type:'code_verifier_invalid'})
                }else{
                    next()
                }
            }
        }
    }else{
        next()
    }
}

module.exports = {
    clientIdMWcEx,
    redirectUriMWcEx,
    secretMWcEX,
    grantTypeMWcEX,
    codeMWcEX,
    codeChallengeMWcEx
}