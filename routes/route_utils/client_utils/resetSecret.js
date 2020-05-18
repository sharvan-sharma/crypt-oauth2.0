const Client = require('../../../src/config/models/client.model')

const generatesecret = (secretLength)=>{
    const charstring = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890'
    let secret = ''
    for (let i = 0; i < secretLength; i++) {
        secret = secret + charstring[Math.floor(Math.random() * charstring.length)]
        if (i === secretLength - 1) {
            return secret
        }
    }
}

function resetsecret(req,res,next){
    if(!req.body.project_id){
        res.json({status:423})
    }else{
    Client.findOneAndUpdate({dev_id:req.user._id,_id:req.body.project_id},{'$set':{client_secret:generatesecret(24)}},{new:true},(err,doc)=>{
        if(err){res.json({status:500})}
        else{
            res.json({status:200,client_secret:doc.client_secret})
        }
    })
}
}

module.exports = resetsecret