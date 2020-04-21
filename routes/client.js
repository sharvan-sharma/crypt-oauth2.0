const express = require('express')
const client = require('./route_utils/client_utils/index')

const router = express.Router()

router.route('/createproject')
.post(client.VerifyLoggedIn,client.CreateProject)

router.route('/addorigin')
.post(client.VerifyLoggedIn,client.AddOrigin)

router.route('/addredirect')
.post(client.VerifyLoggedIn,client.AddRedirect)

router.route('/generatecredentials')
.post(client.VerifyLoggedIn,client.generateIdAndSecret)

router.route('/editprojectname')
.post(client.VerifyLoggedIn,client.EditProjectName)

router.route('/editorigin')
.post(client.VerifyLoggedIn,client.EditOrigin)

router.route('/editredirect')
.post(client.VerifyLoggedIn,client.EditRedirect)

router.route('/deleteproject')
.post(client.VerifyLoggedIn,client.DeleteProject)

router.route('/deleteorigin')
.post(client.VerifyLoggedIn,client.DeleteOrigin)

router.route('/deleteredirect')
.post(client.VerifyLoggedIn,client.DeleteRedirect)

router.route('/deleteallorigins')
.post(client.VerifyLoggedIn,client.DeleteAllOrigins)

router.route('/deleteallredirects')
.post(client.VerifyLoggedIn,client.DeleteAllRedirects)



module.exports = router