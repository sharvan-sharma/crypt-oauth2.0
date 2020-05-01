const Client =require('../../../src/config/models/client.model')

function edithomepage(req,res,next){
 Client.findOneAndUpdate({dev_id:req.user._id,_id:req.body.project_id},{'$set':{
        homepagelink:req.body.new_link
    }},{strict:false,new:true},(err,doc)=>{

        if(err){res.json({status:500})}
        else{
            res.json({status:200,homepagelink:doc.homepagelink})
        }
    })
}

module.exports = edithomepage