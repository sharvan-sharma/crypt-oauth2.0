//return originuri

const Client = require('../../../src/config/models/client.model')

function addOrigin(req,res,next){
     const {uri,projectname}  = req.body
     Client.findOne({dev_id:req.user._id,projectname},{OriginURIs:1},(err,clientdoc)=>{
          if(err){res.json({error:'server_error'})}
          else if(clientdoc){
               if(clientdoc.toObject().OriginURIs !== undefined){
                    var flag = clientdoc.toObject().OriginURIs.some(ouri=>ouri.uri !== uri)
               }else{
                    var flag = true
               }
               if(flag){
                         Client.findOneAndUpdate({dev_id:req.user._id,projectname},{'$push':{OriginURIs:{uri}}},{strict:false},(err,document)=>{
                         if(err){res.json({error:'server_error'})}
                         else{res.json({status:200})}
                         })
               }else{
                         res.json({error:'uri already exists'})
               }
          }else{res.json({error:'unrecognised app'})}
     })
}

module.exports = addOrigin