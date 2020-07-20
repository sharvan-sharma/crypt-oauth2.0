const {Transactions} = require('../../../src/config/models')
const querystring = require('querystring')

module.exports = (req,res,next) => {
    Transactions.create({
        client_id:req.query.client_id,
        client_doc_id:req.body.form._id,
        state:(req.query.state !== undefined)?req.query.state:null,
        code_challenge:(req.query.code_challenge !== undefined)?req.query.code_challenge:null,
        code_challenge_method:(req.query.code_challenge  !== undefined)?req.query.code_challenge_method:null,
        scope:req.query.scope,
        project_id:req.body.form.project_id,
        redirect_uri:req.query.redirect_uri
    },(err,transaction)=>{
        if(err){
            res.json({
                status:500,
                error: 'Server_Error',
                error_description: 'Error occured while processing this Request',
            })
        }else{
            const urlstring = querystring.stringify({
                transaction_id:transaction._id.toString()
            })
            if(req.isAuthenticated()){
                res.json({status:200,urlstring,authenticated:true})
                // res.status(302).redirect('/oauth/decision'+urlstring)
            }else{
                res.json({status:200,urlstring,authenticated:false})
                // res.status(302).redirect('/authapi/login'+urlstring)
            }
        }
    })
}