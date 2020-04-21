//return originuri

const Client = require('../../../src/config/models/client.model')

const checkuri = (uri,uriarray)=>{
     let promise = new Promise(resolve=>{
          if(uriarray.length === 0){
               resolve(true)
          }else{
               let flag = uriarray.every(ele=>{
                         if(ele.uri !== uri){
                              return true
                         }else{
                              return false
                         }
                    })
               resolve(flag)
          }
     })
     return promise
}

function addOrigin(req,res,next){
     const {uri,project_id}  = req.body
     Client.findOne({dev_id:req.user._id,_id:project_id},{OriginURIs:1},(err,clientdoc)=>{
          if(err){res.json({error:'server_error'})}
          else if(clientdoc){
               let promise = checkuri(uri,clientdoc.toObject().OriginURIs)
               promise.then(flag=>{
                    if(flag){
                         Client.findOneAndUpdate({dev_id:req.user._id,_id:project_id},{'$push':{OriginURIs:{uri}}},{strict:false},(err,document)=>{
                                   if(err){res.json({error:'server_error'})}
                                   else{res.json({status:200})}
                         })
                    }else{
                              res.json({error:'uri already exists'})
                    }
               })
          }else{res.json({error:'unrecognised app'})}
     })
}

module.exports = addOrigin