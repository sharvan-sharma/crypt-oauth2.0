const Client = require('../../../src/config/models/client.model')
const User = require('../../../src/config/models/user.model')

function deleteProject(req, res, next) {
    const {
        project_id
    } = req.body
    Client.findOneAndDelete({
        _id: project_id,
        dev_id: req.user._id
    }, (err,doc) => {
        if (err) {
            res.json({
                error: 'server_error'
            })
        } else if(doc) {
            User.findOneAndUpdate({_id:doc.dev_id},{
                '$pull':{
                    apps:{appdocID:project_id}
                }
            },{strict:false,new:true},(err,userdoc)=>{
                if(err){
                    res.json({error:'server_err',err})
                }else{
                     res.json({
                        status: 200,userdoc
                    }) 
                }
            })
        }else{
            res.json({error:'client doesnot exists'})
        }
    })
}

module.exports = deleteProject