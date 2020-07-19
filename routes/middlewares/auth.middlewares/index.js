const register = require('./register')
const validateRegistration = require('./validateRegistration')
const logout = require('./logout')
const setUserActive = require('./setUserActive')
const verify = require('./verify')
const passwordResetEmail = require('./passwordResetEmail')
const verifyPasswordResetEmail = require('./verifyPasswordResetEmail')
const resetPassword = require('./resetPassword')
const validateLogin = require('./validateLogin')

module.exports = {
    register,
    validateRegistration,
    logout,
    setUserActive,
    verify,
    passwordResetEmail,
    verifyPasswordResetEmail,
    resetPassword,
    validateLogin
}