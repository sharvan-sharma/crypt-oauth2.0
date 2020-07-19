const { Forms } = require('../../../src/config/models')
const { winslogger } = require('../../../src/logger')

module.exports = (req,res,next) => {
    if(req.body.form_id === undefined || req.body.form_id.length < 24){
        res.json({status:423,error_type:'form_id'})
    }else{
        Forms.findOneAndDelete({_id:req.body.form_id},(err,form)=>{
            if(err){
                res.json({status:500,error_type:'server'})
                winslogger.error(`user - error while deleting form by user ${req.user.username}`)
            }else{
                res.json({status:200,form_id:req.body.form_id})
            }
        })
    }
}