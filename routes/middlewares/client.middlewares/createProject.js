const {Projects,Consents} = require('../../../src/config/models')
const {winslogger} = require('../../../src/logger')

const createProject = async (req,res,next) => {

    if(req.body.project_name === undefined || req.body.project_name.includes(' ') || req.body.project_name.length < 3){
        res.json({status:423,error_type:'project_name'})
    }else{
        Projects.create({
            name:req.body.project_name,
            user_id:req.user._id
        },(err,project) => {
            if(err){
                res.json({status:500,error_type:'server_error'})
                winslogger.error(`user - error while creating project by user ${req.user.username}`)
            }else{
                res.json({status:200,project})
            }
        })
    }

}

module.exports = createProject

