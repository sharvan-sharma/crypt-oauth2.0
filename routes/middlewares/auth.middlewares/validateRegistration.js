
const {validName,validUserName,isEmail} = require('../../../src/utils/validations')

module.exports = (req,res,next) =>  {

    const  {name,email,password,username} = req.body
    
    if(name === undefined || !validName(name)){
        res.json({status:423,error_type:'name'})  
    }else if(email === undefined || !isEmail(email)){
        res.json({status:423,error_type:'email'}) 
    }else if(username === undefined || !validUserName(username)){
        res.json({status:423,error_type:'username'}) 
    }else if(password === undefined || password.length > 25 || password.length < 8){
        res.json({status:423,error_type:'password'})
    }else{
        next()
    }

}