const { DeviceCodes } =require('../../../src/config/models')

const arr = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' ')

const generateCode = ()=>{
    let str = ''

    for(let i = 0 ; i < 8 ; i++){
        const index = Math.floor(Math.random() * 26);
        str = str + arr[index]
    }
    
    return str
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

module.exports = sendDeviceCode