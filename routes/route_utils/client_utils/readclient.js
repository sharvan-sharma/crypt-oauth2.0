
const Client =require('../../../src/config/models/client.model')

function readClient(req,res,next){
    Client.findOne({dev_id:req.user._id,_id:req.body.project_id},(err,doc)=>{
        if(err){res.json({status:500})}
        else{
            res.json({status:200,doc})
        }
    })
}

module.exports = readClient