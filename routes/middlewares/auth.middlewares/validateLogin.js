const {Users} = require('../../../src/config/models')

module.exports = (req,res,next) => {
    const {username,password} = req.body 
    if(password === 'undefined' || password.length > 25  ||  password.length < 8){
        res.json({status:423,error_type:'password'})
    }else if(username === undefined){
        res.json({status:423,error_type:'username'})
    }else{
        Users.findByUsername(username,(err,user)=>{
            if(err){
                res.json({status:500,error_type:'server'})
            }else if(user){
                if(user.verified){
                    if(user.status === 'A'){
                        next()
                    }else{
                        res.json({status:422,error_type:'settoinactive'})
                    }
                }else{
                    res.json({status:422,error_type:'unverified'})
                }
            }else{
                res.json({status:422,error_type:'UserDoesNotExist'})
            }
        })
    }
} 