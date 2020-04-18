const Client = require('../../../src/config/models/client.model')

function addRedirect(req,res,next){
     const {uri,projectname}  = req.body
     Client.findOne({dev_id:req.user._id,projectname},{ RedirectURIs:1},(err,clientdoc)=>{
          if(err){res.json({error:'server_error'})}
          else if(clientdoc){
               if(clientdoc.toObject().RedirectURIs !== undefined){
                    var flag = clientdoc.toObject().RedirectURIs.some(ouri=>ouri.uri !== uri)
               }else{
                    var flag = true
               }
               if(flag){
                    Client.findOneAndUpdate({dev_id:req.user._id,projectname},{'$push':{RedirectURIs:{uri}}},{strict:false},(err,document)=>{
                        if(err){res.json({error:'server_error'})}
                        else{res.json({status:200})}
                    })
               }else{
                    res.json({error:'uri already exists'})
               }
          }else{res.json({error:'unrecognised app'})}
     })
}

module.exports = addRedirect