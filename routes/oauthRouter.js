const express = require('express');
const router = express.Router();
const oauth = require('./middlewares/oauth.middlewares')
const {clientIdMW,redirectUriMW,scopesMW,responseTypeMW,codeChallengeMW} = require('./middlewares/oauth.middlewares/validateAuthCodeMW')
const { validateDecision, sendAuthCode } = require('./middlewares/oauth.middlewares/sendAuthCode')
const { clientIdMWcEx,redirectUriMWcEx,secretMWcEX,grantTypeMWcEX,codeMWcEX,codeChallengeMWcEx} = require('./middlewares/oauth.middlewares/validateTokenExchange')


router.get('/', (req,res) => res.send('oauthRoutes'))

//firts redirection from client
router.route('/authorization')
    .get(clientIdMW,
        redirectUriMW,
        scopesMW,
        responseTypeMW,
        codeChallengeMW,
        oauth.createTransaction)

// router.route('/getclient')
//     .post(oauth.GetClient)

//decision from  user 
router.route('/decision')
    .post(validateDecision,
        sendAuthCode)

//exchange cryptId from authCode
router.route('/token/exchange')
    .post(clientIdMWcEx,
        redirectUriMWcEx,
        secretMWcEX,
        grantTypeMWcEX,
        codeMWcEX,
        codeChallengeMWcEx,
        oauth.tokenExchange)

//route to refressh access token
router.route('/token/refresh')
        .post(oauth.refreshAccessToken)


router.route('/authorization/device')
        .get(
            clientIdMW,//because of body
            scopesMW,
            oauth.sendDeviceCode
        )

router.route('/device')
        .get(oauth.userDeviceReq)

router.route('/device/token')
        .post(clientIdMWcEx,
            grantTypeMWcEX,
            oauth.validateDeviceTokenReq,
            oauth.tokenExchange)

router.route('/device/decision')
        .post(oauth.userDecision)

module.exports = router;