const {oauthlogger, winslogger} = require('../../../src/logger')
const { Transactions, AuthCodes, UserClientMapping } = require('../../../src/config/models')
const querystring = require('querystring')
const jwt = require('jsonwebtoken')

const validateDecision = (req,res,next) => {
    const  { transaction_id, decision } = req.body

    if( transaction_id === undefined || transaction_id.length < 24 ){
        res.json({error_tyoe:'transaction_id',status:423})
    }else if(decision === undefined || !['allow','deny'].includes(decision)){
        res.json({error_tyoe:'decision',status:423})
    }else next()
}


const sendAuthCode = async (req,res,next) => {

    const  { transaction_id, decision } = req.body 

    Transactions.findOneAndDelete(
        {_id:transaction_id}
        ,async (err,transaction) => {
            if(err){
                res.json({
                    status:500,
                    error: 'server_error',
                    error_description: 'error encountered at server',
                    error_uri: process.env.ERROR_URI
                })
                winslogger.error(`user - error while deleting transaction ${transaction_id}`)
            }else if(transaction){
                if(decision === 'allow'){

                    AuthCodes.create({
                        client_id:transaction.client_id,
                        redirect_uri:transaction.redirect_uri,
                        user_id:req.user._id,
                        code_challenge:transaction.code_challenge,
                        code_challenge_method:transaction.code_challenge_method
                    },(err,auth_code)=>{
                        if(err){
                            const urlstring = querystring.stringify({
                                error: 'server_error',
                                error_description: 'error encountered at server',
                                error_uri: process.env.ERROR_URI
                            })
                            res.json({status:200,type:'denied',url:transaction.redirect_uri+'?'+urlstring})
                           // res.status(302).redirect(transaction.redirect_uri+'?'+urlstring)
                        }else{
                            jwt.sign({id:auth_code._id},process.env.AUTH_SECRET, {expiresIn: 300},(err,token)=>{
                                if(err){
                                    const urlstring = querystring.stringify({
                                        error: 'server_error',
                                        error_description: 'error encountered at server',
                                        error_uri: process.env.ERROR_URI
                                    })
                                    res.json({status:200,type:'denied',url:transaction.redirect_uri+'?'+urlstring})
                                    //res.status(302).redirect(transaction.redirect_uri+'?'+urlstring)
                                }else{
                                    const urlstring = querystring.stringify({
                                        code:token,
                                        state:transaction.state
                                    })
                                    res.json({status:200,type:'allow',url:transaction.redirect_uri+'?'+urlstring})
                                    res.status(302).redirect(transaction.redirect_uri+'?'+urlstring)
                                }
                            })
                        }
                    })


                    try{
                        const exist = await UserClientMapping.exists({user_id:req.user._id,client_doc_id:transaction.client_doc_id})
                        if(!exist){
                            await  UserClientMapping.create({
                                user_id:req.user._id,
                                client_doc_id:transaction.client_doc_id,
                                scope:transaction.scope})
                        }
                    }catch{
                        oauthlogger.error(`user - error while creating user_client mapping for user !
                                ${req.user.username} and client ${transaction.client_doc_id}`)
                    }

                }else{
                    const urlstring = querystring.stringify({
                        error: 'access_denied',
                        error_description: 'user denied the request',
                        error_uri: process.env.ERROR_URI
                    })
                    res.json({status:200,type:'denied',url:transaction.redirect_uri+'?'+urlstring})
                   // res.status(302).redirect(transaction.redirect_uri+'?'+urlstring)         
                }
            }else{
                res.json({
                    status:422,
                    error: 'transaction_expired',
                    error_description: 'transaction has expired,reinitiate the transaction',
                    error_uri: process.env.ERROR_URI
                })
            }
        }
    )
}

module.exports = {
    sendAuthCode,
    validateDecision
}