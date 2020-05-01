const Client = require('../../../src/config/models/client.model')

const allclients = (req,res,next)=>{
Client.find({},{projectname:1,homepagelink:1,description:1,_id:0},(err,array)=>{
    if(err){res.json({status:500})}
    else {
        res.json({status:200,array})
    }
})
}

module.exports = allclients