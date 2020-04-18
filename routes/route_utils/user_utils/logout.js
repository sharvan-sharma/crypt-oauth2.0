const User =  require('../../../src/config/models/user.model')
const winslog = require('../../../src/config/winston')


function logout(req,res,next){
    if(req.isAuthenticated()){
        User.findOneAndUpdate({username:req.user.username},{
            '$set':{
                status:'IA'
            }
        },{strict:false},(err)=>{
            if(err){
                res.json({error:'server_error'})
            }else{
                winslog.log({level:'info',message:req.user.username+" its getting logout.remaining user"+count});
                req.logout();
                res.json({status:200,user:''});
            }
        })
           
    }else{
            winslog.log({level:'info',message:'login first to logout'});
            res.json({status:403});
    }
}

module.exports = logout