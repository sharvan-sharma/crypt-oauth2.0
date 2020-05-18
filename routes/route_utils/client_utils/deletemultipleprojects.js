const Client = require('../../../src/config/models/client.model')

function deletemultipleprojects(req,res,next){
    if(!req.body.array){
        res.json({status:423})
    }else{
    Client.deleteMany({dev_id:req.user._id,client_id:{$in:req.body.array}},(err)=>{
        if(err){
            res.json({status:500})
        }else{
            res.json({status:200})
        }
    })
}
}

module.exports = deletemultipleprojects