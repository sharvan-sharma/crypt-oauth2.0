const {Forms} = require('../../../src/config/models')
const { winslogger } = require('../../../src/logger')
const isUrl = require('../../../src/utils/validations/isUrl')
const generateSecret = require('../../../src/utils/generateSecret')


const formHelper = {
    validateFormId:(req,res,next) => {
        if(req.body.form_id === undefined || req.body.form_id.length < 24){
            res.json({status:423,error_type:'form_id'})
        }else{
            next()
        }
    },
    name : (req,res,next) => {
        const {form_id,new_form_name} = req.body
        
        if(new_form_name === undefined || new_form_name.length < 3 || new_form_name.includes(' ')){
            res.json({status:423,error_type:'name'})
        }else{
            Forms.findOneAndUpdate({_id:form_id},
                {$set:{name:new_form_name}}
                ,{new:true},
                (err,form)=>{
                    if(err){
                        res.json({status:500,error_type:'server'})
                        winslogger.error(`user - error while updateing form name by user ${req.user.username}`)
                    }else{
                        res.json({status:200,form})
                    }
                })
        }
    },
    reset:async (req,res,next) => {
        try{
            const form = await Forms.findOne({_id:req.body.form_id})
            if(form.client_type === 'ssa'){
                const secret = generateSecret()
                Forms.findOneAndUpdate(
                    {_id:req.body.form_id},
                    {
                        $set:{client_secret : secret}
                    },{new:true},
                    (err,form)=>{
                        if(err){
                            res.json({status:500,error_type:'server'})
                            winslogger.error(`user - error while udating form secret by user ${req.user.username}`)
                        }else{
                            res.json({status:200,form})
                        }
                    }
                )
            }else{
                res.json({status:455,error_type:'NotaSSA'})
            }
        }catch{
            res.json({status:500,error_type:'server_error'})
            winslogger.error(`user - error while finding form by user ${req.user.username}`)
        }
    },
    addUri : async (req,res,next) => {
        const {form_id,uri,type} = req.body 
        if(uri === undefined || !isUrl(uri)){
            res.json({status:423,error_type:'invalid_uri'})
        }else if(type === undefined || !['redirect','origin'].includes(type)){
            res.json({status:423,error_type:'invalid_uri_type'})
        }else{
            const form = (await Forms.findOne({_id:req.body.form_id})).toObject()
            
            const checkArray = (type !== 'origin')? form.redirect_uris : form.origin_uris

            const exist = checkArray.some(ele => ele.uri === uri)


            if(exist){
                res.json({status:423,error_type:'duplicate_uri'})
            }else{
                const obj = (type === 'origin') ? {origin_uris:{uri}}: {redirect_uris:{uri}}

                console.log(obj)

                Forms.findOneAndUpdate(
                    {_id:form_id},
                    {
                        $push:obj
                    },{new:true,strict:false},
                    (err,form)=>{
                        if(err){
                            res.json({status:500,error_type:'server'})
                            winslogger.error(`user - error while adding uri from form ${type}  secret by user ${req.user.username}`)
                        }else{
                            res.json({status:200,form})
                        }
                    }
                )
            }

        }
    },
    removeUri : (req,res,next)=>{
        const {form_id,uri_id,type} = req.body 
        if(uri_id === undefined || uri_id.length < 24){
            res.json({status:423,error_type:'invalid_uri_id'})
        }else if(type === undefined || !['redirect','origin'].includes(type)){
            res.json({status:423,error_type:'invalid_type'})
        }else{
            const obj = (type === 'origin') ? {origin_uris:{_id:uri_id}}:{redirect_uris:{_id:uri_id}}
            Forms.findOneAndUpdate(
                {_id:form_id},
                {
                    $pull:obj
                },
                {new:true},
                (err,form)=>{
                    if(err){
                        res.json({status:500,error_type:'server'})
                        winslogger.error(`user - error while remove uri from form ${type} by user ${req.user.username}`)
                    }else{
                        res.json({status:200,form})
                    }
                }
            )
        }
    }
}

module.exports = formHelper