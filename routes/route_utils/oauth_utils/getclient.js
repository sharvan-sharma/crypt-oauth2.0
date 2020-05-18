
const Transaction = require('../../../src/config/models/transaction.model')
const Client = require('../../../src/config/models/client.model')

function getClient(req,res,next){
    if(!req.body.transaction_id){
        res.json({status:423})
    }else{
    Transaction.findOne({_id:req.body.transaction_id},{client_id:1,redirect_uri:1},(err,doc)=>{
        if(err){res.json({status:500})}
        else if(doc){
            Client.findOne({client_id:doc.client_id},{projectname:1,scope:1},(err,document)=>{
                if(err){res.json({status:500})}
                else if(document){
                    res.json({projectname:document.projectname,
                              scope:document.scope,
                              status:200,
                               redirect_uri:doc.redirect_uri})
                }else{
                    res.json({status:422})
                }
            })
        }
        else{res.json({status:422})}
    })
}
}

module.exports = getClient