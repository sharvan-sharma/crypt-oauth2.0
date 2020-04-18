const Client = require('../../../src/config/models/client.model')

function deleteredirect(req,res,next){
    const {uri_id,project_id} = req.body
    if(uri_id === undefined || project_id === undefined){
        res.json({error:'malformed_request'})
    }else{
        Client.findOneAndUpdate({dev_id:req.user._id,_id:project_id},
                                 {'$pull':{
                                     'RedirectURIs':{$elemMatch: {_id:uri_id}}
                                 }},(err)=>{
                                     if(err){res.json({error:'server_error'})}
                                     else{res.json({status:200})}
                                 })
    }
}

module.exports = deleteredirect