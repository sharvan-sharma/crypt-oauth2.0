const {DeviceCodes,UserClientMapping} = require('../../../src/config/models')
const {oauthlogger} = require('../../../src/logger')

const userDecision = (req,res,next) => {
    const {id} = req.query
    const {decision} = req.body 

    if(decision === undefined || !['allow','deny'].includes(decision)){
        res.json({
            status:423,error_type:'decision'
        })
    }else{
        DeviceCodes.findOneAndUpdate({_id:id},
            {
                $set:{
                    decision,
                    user_id:(decision === 'allow')?req.user._id:null
                }
            },
            async (err,dc)=>{
                if(err){
                    res.json({status:500,error_type:'server'})
                }else{
                    res.json({status:200,msg:'success'})
               
                    try{
                        const exist = await UserClientMapping.exists({user_id:req.user._id,client_doc_id:dc.client_doc_id})
                        if(!exist){
                            await  UserClientMapping.create({
                                user_id:req.user._id,
                                client_doc_id:dc.client_doc_id,
                                scope:dc.scope})
                        }
                    }catch{
                        oauthlogger.error(`user - error while creating user_client mapping for user !
                            ${req.user.username} and client ${transaction.client_doc_id}`)
                    }
                }
            })
    }
}

module.exports = userDecision