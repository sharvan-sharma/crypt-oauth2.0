
const jwt = require('jsonwebtoken')
const { UserClientMapping, Users}  = require('../../../src/config/models')
const {winslogger} = require('../../../src/logger')

const validateAccesTokenMW = (req,res,next) => {
    const {access_token} = req.query

    if(access_token === undefined || access_token.length < 160){
        res.json({status:423,error_type:'access_token'})
    }else{
        jwt.verify(access_token.split(' ')[1], process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    res.json({
                        error: 'token_expired',status:455
                    })
                } else {
                    res.json({
                        error: 'server_error',status:500
                    })
                }
            } else {
                req.body.payload = payload
                next()
            }
        })
    }
}

const validateUserClientMW = async (req,res,next) => {
    const {payload} = req.body
    try{
        const ucm = await UserClientMapping.findOne({user_id:payload.user_id,client_doc_id:payload.client_doc_id})
        if(ucm){
            req.body.payload.scope = ucm.scope 
            next()
        }else{
            res.json({status:423,error_type:'access_revoked'})
        }
    }catch{
        res.json({status:500,error_type:'server'})
        winslogger.error(`user- error while finding userclient mapping in res api`)
    }
}

const sendInfoMW = (req,res,next) => {
    Users.findOne({_id:req.body.payload.user_id},(err,user)=>{
        if (err) {
                    res.json({
                        error: 'server_error',
                        error_description: 'error_ocurred while processing request',
                        error_uri: process.env.ERROR_URI
                    })
                    winslogger.error(`user-error while send info user`)
        } else {
            const obj = {}
            if(scope.includes('email')){
                obj.email = user.email
            }
            
            if(scope.includes('profile')){
                obj.name = user.name
                obj.photo = user.photo
                obj.email = user.email
                obj.username = user.username
                obj.cryptId = user._id
            }

            res.json({
                status:200,
                ...obj
            })
        }
    })
}

module.exports = {
    sendInfoMW,
    validateAccesTokenMW,
    validateUserClientMW
}