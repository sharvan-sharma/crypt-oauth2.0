const express = require('express')
const oauth = require('./route_utils/oauth_utils/index')

const router = express.Router()

//firts redirection from client
router.route('/authorization')
.post(oauth.ValidateAuthCode,oauth.EnsureLogin)

router.route('/getclient')
.post(oauth.GetClient)

//decision from  user 
router.route('/decision')
.post(oauth.SendAuthCode)

//exchange cryptId from authCode
router.route('/tokenexchange')
.post(oauth.ValidateCodeEx,oauth.CodeExchange)

//route to refressh access token
router.route('/refreshtoken')
.post(oauth.RefreshAccessToken)




module.exports = router