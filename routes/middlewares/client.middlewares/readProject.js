const { Projects} = require('../../../src/config/models')
const { winslogger } = require('../../../src/logger')

module.exports = (req,res,next) => {
    const {project_id} = req.body

    if(project_id === undefined || project_id.length < 24){
        res.json({status:423,error_type:'project_id'})   
    }else{
        Projects.findOne({_id:project_id},(err,project) => {
            if(err){
                res.json({status:500,error_type:'server_error'})
                winslogger.error(`user - error while reading project of usser ${req.user.username}`)
            }else{
                res.json({status:200,project})
            }
        })
    }
}