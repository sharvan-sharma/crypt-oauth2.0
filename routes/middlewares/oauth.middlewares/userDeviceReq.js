const querystring = require('querystring')

const userDeviceReq = (req,res,next) => {
    const {id} = req.query
    if(req.isAuthenticated()){
        res.json({status:200,authenticated:true,id})
        // res.status(302).redirect('/oauth/device/decision?id='+id)
    }else{
        res.json({status:200,authenticated:false,id})
        // res.status(302).redirect('/authapi/login?d_id='+id)
    }
}

module.exports = userDeviceReq