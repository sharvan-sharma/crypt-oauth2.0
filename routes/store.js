const express = require('express')
const store = require('./route_utils/store_utils/index')

const router = express.Router()

router.route('/allclients')
.get(store.AllClients)

module.exports = router
