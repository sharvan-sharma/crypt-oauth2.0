
const Client = require('../../../src/config/models/client.model')

function Search(req,res,next){
    const regexp = new RegExp(req.body.query,'i')
    Client.find({dev_id:req.user._id,projectname:{$regex:regexp} },
                {projectname:1,type:1,created_at:1,client_id:1},
                (err,array)=>{
                if(err){
                    console.log(err)
                    res.json({status:500})
                }else{
                     res.json({
                                array
                            })
                    }
    })
}

module.exports = Search