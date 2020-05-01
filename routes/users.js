const express = require('express');
const appRoot = require('app-root-path');
const userpassport = require(`../src/config/userPassport`);
const winslog = require('../src/config/winston');
const user = require('../routes/route_utils/user_utils/index')

const router = express.Router();

router.get('/favicon.ico',(req,res)=>res.status(204))

router.get('/', (req, res) => res.json({msg:'welcome to crypt api server'}))

router.route('/checklogin')
    .get(user.CheckLogin)

router.route('/checkusername')
    .post(user.CheckUserName)

router.route('/checkemail')
    .post(user.CheckEmail)

router.route('/register')
    .post(user.Register)

router.route('/vu')//verifyuser
    .post(user.VerifyEmail,
        userpassport.authenticate('local', {
            successRedirect: '/loginsuccess',
            failureRedirect: '/loginfail'
        }))

router.route('/login')
    .all(user.ValidateVerify,userpassport.authenticate('local', {
        successRedirect: '/loginsuccess',
        failureRedirect: '/loginfail'
    }))

router.route('/loginsuccess')
    .get(user.SetActive)

router.route('/loginfail')
    .get((req, res) => res.json({
        status: 401,
        user: null
    }))

router.route('/forgotpwd')
    .post(user.PasswordResetEmail)

router.route('/vpr')//verifyPasswordResetEmail
    .post(user.VerifyPasswordResetEmail)

router.route('/changepassword')
    .post(user.ResetPassword,
        userpassport.authenticate('local', {
            successRedirect: '/loginsuccess',
            failureRedirect: '/loginfail'
        }))

router.route('/revokeaccess')
.post(user.RevokeAccess)

router.route('/logout')
    .get(user.Logout);

router.route('/readapprovedclients')
    .get(user.ReadApprovedClients)



module.exports = router;