const jwt = require('jsonwebtoken')
const User = require('../../../src/config/models/user.model')

function verifyemail(req,res,next){
 jwt.verify(req.body.token,proces.env.EMAIL_SECRET,(err,payload)=>{
     if(err){
         if(err.name ===  'TokenExpiredError'){res.json({status:422,error:'token_exipred'})}
         else{res.json({error:'server_error',status:500})}
     }else{
        User.findOneAndUpdate({username:payload.username,password:payload.password},
            {'$set':{
                verified:true
            }},{strict:false},(err)=>{
                if(err){
                    res.json({error:'server_error',status:500})
                }else{
                      req.body.username = payload.username
                      req.body.password = payload.password
                      next();
                }
            })
     }
 })    
}

module.exports = verifyemail