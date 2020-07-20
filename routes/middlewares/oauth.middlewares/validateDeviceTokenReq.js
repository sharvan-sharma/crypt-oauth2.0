const { DeviceCodes } = require("../../../src/config/models")

const validateDeviceTokenReq = (req,res,next) => {
    const {client_id,device_code} = req.body  
    DeviceCodes.findOneAndUpdate({_id:device_code},
        {
            $set : {
                last:Date.now()
            }
        },
        (err,code)=>{
            if(err){
                res.json({status:200,error_type:'server'})
            }else if(code){
                if(code.decision === 'allow'){
                    req.body.auth_code = {user_id:code.user_id}
                    req.body.form = {_id:code.client_doc_id}
                    next()
                }else if(code.decision === 'deny'){
                    res.json({status:422,error_type:"access_denied"})
                }else{
                    if(new Date().getSeconds() - new Date(code.last).getSeconds() < 10){
                        res.json({status:422,error_type:"slow_down"})
                    }else{
                        res.json({status:422,error_type:"authorization_pending"})
                    }
                }
            }else{
                res.json({status:422,error_type:"expired_token"})
            }
        })
}

module.exports = validateDeviceTokenReq

