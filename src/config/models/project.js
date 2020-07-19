const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
    createdAt:{type:Date,default:Date.now},
    name:{type:String,required:true},
    user_id:{type:String,required:true},
    homepage:{type:String,default:null},
    privacy_policy:{type:String,default:null},
    tos:{type:String,default:null},
    logo:{type:String,default:null},
    support_email:{type:String,default:null},
    scopes:[{type:String}],
})

const Projects = mongoose.model('projects',projectSchema)

module.exports = Projects