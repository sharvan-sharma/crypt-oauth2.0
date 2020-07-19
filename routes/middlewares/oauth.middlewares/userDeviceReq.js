const querystring = require('querystring')

const userDeviceReq = (req,res,next) => {
    const {id} = req.query
    if(req.isAuthenticated()){
        res.status(302).redirect('/oauth/device/decision?id='+id)
    }else{
        res.status(302).redirect('/authapi/login?d_id='+id)
    }
}

module.exports = userDeviceReq