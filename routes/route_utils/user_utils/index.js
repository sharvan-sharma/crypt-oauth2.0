const Register = require('./register')
const CheckUserName = require('./checkusername')
const CheckEmail =  require('./checkemail')
const Logout = require('./logout')
const SetActive =  require('./setActive')
const PasswordResetEmail = require('./passwordResetEmail')
const VerifyEmail = require('./verifyEmail')
const VerifyPasswordResetEmail = require('./verifypwdresetemail')
const ResetPassword = require('./resetPassword')

module.exports = {
    Register,
    CheckUserName,
    CheckEmail,
    Logout,
    SetActive,
    PasswordResetEmail,
    VerifyEmail,
    VerifyPasswordResetEmail,
    ResetPassword
}