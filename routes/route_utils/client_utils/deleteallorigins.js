const Client = require('../../../src/config/models/client.model')

const deleteallorigins = (req,res,next)=>{
    if(req.body.project_id === undefined){
        res.json({error:'missing_parameters'})
    }else{
        Client.updateOne({dev_id:req.user._id,_id:req.body.project_id},//update on is used instead of findOneAndUpdate
                                 {'$set':
                                    {'OriginURIs':[]}
                                },{strict:false},
                                 (err,raw)=>{
                                     if(err){
                                         res.json({err:"server_error"})
                                     }else if(raw){
                                         res.json({status:200,raw})
                                     }
                                 })
    }
} 

module.exports = deleteallorigins