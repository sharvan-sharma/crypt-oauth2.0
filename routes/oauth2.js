const express = require('express')
const oauth = require('./route_utils/oauth_utils/index')

const router = express.Router()

//firts redirection from client
router.route('/authorization')
.post(oauth.ValidateAuthCode,oauth.EnsureLogin)

//decision from  user 
router.route('/decision')
.post(oauth.SendAuthCode)

//exchange cryptId from authCode
router.route('/codeexchange')
.post(oauth.ValidateCodeEx,oauth.CodeExchange)



module.exports = router