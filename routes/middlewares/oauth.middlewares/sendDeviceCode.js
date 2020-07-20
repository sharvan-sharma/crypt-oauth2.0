const { DeviceCodes, Forms } =require('../../../src/config/models')

const arr = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' ')

const generateCode = ()=>{
    let str = ''

    for(let i = 0 ; i < 8 ; i++){
        const index = Math.floor(Math.random() * 26);
        str = str + arr[index]
    }
    
    return str
}

const clientIdDeviceMW = (req,res,next) => {
    const {client_id} = req.query
    
    Forms.findOne({client_id}, (err, form) => {
            if (err) {
                res.json({
                    status:500,
                    error: 'Server_Error',
                    error_description: 'Error occured while processing this Request',
                    error_uri: process.env.ERROR_URI
                })
            } else if (form){
                if(form.client_type === 'brl'){
                    req.body.form = form.toObject()
                    next()
                }else{
                    res.json({
                        status:401,
                        error: 'NOT_A_DEVICE',
                        error_description: 'client is not of brl type(browserless)',
                        error_uri: process.env.ERROR_URI
                    })
                }
            }else{
                res.json({
                    status:401,
                    error: 'Unrecognised_Client',
                    error_description: 'No Client is Registered With this Client Id',
                    error_uri: process.env.ERROR_URI
                })
            }
    })
}

const sendDeviceCode = (req,res,next) => {
    
    const user_code = generateCode()

    DeviceCodes.create({
        scope:req.query.scope,
        user_code,
        client_doc_id:req.body.form._id
    },(err,code) => {
        if(err){
            res.json({status:500,error_type:'server_error'})
        }else{
            res.json({
                user_code:code.user_code,
                device_code:code._id,
                verification_uri:process.env.SERVER_DOMAIN+'/oauth/device?id='+code._id,
                interval:10,
                expires_in:1800
            })
        }
    })
}

module.exports = {
    sendDeviceCode,
    clientIdDeviceMW
}