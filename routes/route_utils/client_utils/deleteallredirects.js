const Client = require('../../../src/config/models/client.model')

const deleteallredirects = (req,res,next)=>{
    if(req.body.project_id === undefined){
        res.json({error:'missing_parameters'})
    }else{
        Client.updateOne({dev_id:req.user._id,_id:req.body.project_id},//updateOne is used instead of findOneAndUpdate
                                 {'$set':
                                 {'RedirectURIs':[]}
                                },
                                 (err,raw)=>{
                                     if(err){
                                         res.json({err:"server_error"})
                                     }else{
                                         res.json({status:200})
                                     }
                                 })
    }
} 

module.exports = deleteallredirects