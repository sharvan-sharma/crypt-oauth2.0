const User = require('../../../src/config/models/user.model')
const Client = require('../../../src/config/models/client.model')

function readAllClients(req,res,next){
    User.findOne({_id:req.user._id},{apps:1},(err,doc)=>{
        if(err){res.json({status:500})}
        else{
            if(doc.apps.length > 0){
            let clientarray = doc.toObject().apps.map(app=>{
                return app.appdocID
            })
            Client.find({_id:{$in:clientarray}},{projectname:1,type:1,created_at:1,client_id:1},(err,array)=>{
                if(err){res.json({status:500})}
                else{
                    res.json({
                        array
                    })
                }
            })
        }else{
            res.json({array:[]})
        }
        }
    })
}

module.exports =readAllClients