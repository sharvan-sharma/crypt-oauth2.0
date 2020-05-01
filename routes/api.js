const express = require('express')
const api = require('./route_utils/api_utils/index')

const router = express.Router()

//get Crypt Id,client_id and send part of profile of user
router.route('/userinfo')
.get(api.UserInfo)

module.exports = router