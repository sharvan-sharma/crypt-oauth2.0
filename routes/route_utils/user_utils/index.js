const Register = require('./register')
const CheckUserName = require('./checkusername')
const CheckEmail =  require('./checkemail')
const Logout = require('./logout')
const SetActive =  require('./setActive')
const PasswordResetEmail = require('./passwordResetEmail')
const VerifyEmail = require('./verifyEmail')
const VerifyPasswordResetEmail = require('./verifypwdresetemail')
const ResetPassword = require('./resetPassword')
const RevokeAccess = require('./revokeaccess')
const ValidateVerify = require('./validateverification')
const CheckLogin = require('./checklogin')
const ReadApprovedClients = require('./readApprovedClients')

module.exports = {
    Register,
    CheckUserName,
    CheckEmail,
    Logout,
    SetActive,
    PasswordResetEmail,
    VerifyEmail,
    VerifyPasswordResetEmail,
    ResetPassword,
    RevokeAccess,
    ValidateVerify,
    CheckLogin,
    ReadApprovedClients
}