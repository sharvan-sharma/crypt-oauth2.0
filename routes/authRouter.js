const express = require('express');
const router = express.Router();
const passport = require('../src/config/passportConfig')
const auth = require('./middlewares/auth.middlewares')

router.get('/', (req,res) => res.send('Authentication & Authorization'))

router.route('/login')
      .post(auth.validateLogin,
            passport.authenticate('local',{successRedirect:'/authapi/authsuccess',failureRedirect:'/authapi/authfail'}))

router.route('/authsuccess')
      .get(auth.setUserActive)

router.route('/authfail')
      .get((req,res)=>res.json({status:401,logged_in:false,username:null}))

router.route('/register')
      .post(auth.validateRegistration,auth.register)

router.route('/verify')
      .post(auth.verify,
            passport.authenticate('local',{successRedirect:'/authapi/authsuccess',failureRedirect:'/authapi/authfail'}))

router.route('/forgotpassword')
      .post(auth.passwordResetEmail)

router.route('/verify/pwd/resetemail')
      .post(auth.verifyPasswordResetEmail)

router.route('/change/password')
      .post(auth.resetPassword,
            passport.authenticate('local',{successRedirect:'/authapi/authsuccess',failureRedirect:'/authapi/authfail'}))

router.route('/logout')
      .get(auth.logout)


module.exports = router;
