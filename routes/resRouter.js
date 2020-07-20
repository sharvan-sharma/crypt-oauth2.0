const express = require('express');
const router = express.Router();
const {validateAccesTokenMW,validateUserClientMW,sendInfoMW} = require('./middlewares/res.middlewares/userInfo')

router.get('/', (req, res) =>res.json({msg:'resource api'}));

router.route('/userinfo')
    .get(validateAccesTokenMW,validateUserClientMW,sendInfoMW)

module.exports = router