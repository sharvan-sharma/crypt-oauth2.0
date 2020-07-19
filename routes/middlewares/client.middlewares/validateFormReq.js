

module.exports = (req,res,next) => {
    const {form_name,project_id,client_type} = req.body 

    if(form_name === undefined || form_name.length < 3 || form_name.includes(' ')){
        res.json({type:423,error_type:'name'})
    }else if(project_id === undefined || project_id.length < 24){
        res.json({type:423,error_type:'project_id'})
    }else if(!['ssa','spa','nat','brl'].includes(client_type)){
        res.json({type:423,error_type:'application_type'})
    }else{
        next()
    }
}