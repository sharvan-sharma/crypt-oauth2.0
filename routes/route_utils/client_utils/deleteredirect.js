const Client = require('../../../src/config/models/client.model')

function deleteredirect(req,res,next){
    const {uri_id,project_id} = req.body
    if(uri_id === undefined || project_id === undefined){
        res.json({error:'malformed_request'})
    }else{
        Client.findOneAndUpdate({dev_id:req.user._id,_id:project_id},
                                 {'$pull':{
                                     'RedirectURIs':{_id:uri_id}
                                 }},{new:true},(err,doc)=>{
                                     if(err){res.json({error:'server_error',status:500})}
                                     else if(doc){res.json({status:200,RedirectURIs:doc.RedirectURIs})}
                                     else{res.json({error:'uri donot exists',status:422})}
                                 })
    }
}

module.exports = deleteredirect