const { Forms } = require('../../../src/config/models')
const {winslogger} = require('../../../src/logger')
const generateSecret = require('../../../src/utils/generateSecret')

const createForm = async (req,res,next) => {
    const {form_name,project_id,client_type} = req.body 

    try{
        const form = await Forms.create({name:form_name,client_type,project_id})
        const secret = generateSecret()
        const obj = {client_id:form._id+'.crypt-app'}
        if(client_type === 'ssa') {
            obj.client_secret = secret
        }
        const updform = await Forms.findOneAndUpdate({_id:form._id},{$set:obj},{new:true})

        res.json({status:200,form:updform})
    }catch{
        res.json({error_type:'server',status:500})
            winslogger.error(`user -  error while creating form by user ${req.user.username}`)
    }
}

module.exports = createForm