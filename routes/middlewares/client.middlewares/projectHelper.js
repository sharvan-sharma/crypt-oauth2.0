const { Projects } = require("../../../src/config/models")
const { winslogger } = require("../../../src/logger")
const { isEmail ,isUrl } = require('../../../src/utils/validations')

const validateScopeArray = (arr)=>{
    if(arr.length <= 2){
       
        //sync

        for(let i = 0;i < arr.length;i++){
            if(!['profile','email'].includes(arr[i])){
                return false
            } 
        }

        return true 
    }else{
        return false
    }
}

const consentHelper = {
    validateProjectId:(req,res,next) => {
        if(req.body.project_id === undefined || req.body.project_id.length < 24){
            res.json({status:423,error_type:'project_id'})
        }else next()
    },
    updateName : (req,res,next) =>{
        const {project_id,new_project_name} = req.body
        if(new_project_name === undefined || new_project_name.length < 3 || new_project_name.includes(' ')){
            res.json({status:423,error_type:'name'})
        }else{
            Projects.findOneAndUpdate(
                {_id:project_id},
                {$set:{name:new_project_name}},
                {new:true},
            (err,project)=>{
                if(err) {
                    res.json({status:500,error_type:'server_error'})
                    winslogger.error(`user - error while updating project name of user ${req.user.username}`)
                }else{
                    res.json({status:200,project})
                }
            })
        }
    },
    updateSupportEmail :(req,res,next) =>{
        const {project_id,support_email} = req.body
        if(support_email === undefined || !isEmail(support_email)){
            res.json({status:423,error_type:'email'})
        }else{
            Projects.findOneAndUpdate({_id:project_id},{
                $set:{
                    support_email 
                }
            },{new:true},
            (err,project)=>{
                if(err) {
                    res.json({status:500,error_type:'server_error'})
                    winslogger.error(`user - error while updating project support_email of user ${req.user.username}`)
                }else{
                    res.json({status:200,project})
                }
            })
        }
    },
    updateLinks : (req,res,next) =>{
        const {project_id,link,type} = req.body
        
        if(!['hp','pp','tos'].includes(type)){
            res.json({status:423,error_type:'type'})
        }else if(link === undefined || !isUrl(link)){
            res.json({status:423,error_type:'link'})
        }else{
            const obj = {}

            if(type === 'hp') obj.homepage = link
            else if(type == 'pp') obj.privacy_policy = link 
            else obj.tos = link

            Projects.findOneAndUpdate({_id:project_id},{
                $set:obj
            },{new:true},
            (err,project)=>{
                if(err) {
                    res.json({status:500,error_type:'server_error'})
                    winslogger.error(`user - error while updating project links of user ${req.user.username}`)
                }else{
                    res.json({status:200,project})
                }
            })
        }
    },
    updateScopes : (req,res,next) => {
        const {project_id,scopes} = req.body
        if(!Array.isArray(scopes)){
            res.json({error_type:'scopes',status:423})
        }else if(!validateScopeArray(scopes)){
            res.json({error_type:'scopes',status:423})
        }else{
            Projects.findOneAndUpdate({_id:project_id},{
                $set:{scopes}
            },{new:true},
            (err,project)=>{
                if(err) {
                    res.json({status:500,error_type:'server_error'})
                    winslogger.error(`user - error while updating project scopes of user ${req.user.username}`)
                }else{
                    res.json({status:200,project})
                }
            })
        }
    }
}

module.exports = consentHelper