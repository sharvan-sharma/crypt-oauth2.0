const User = require('../../../src/config/models/user.model')
const userpassport = require('../../../src/config/userPassport')
const utils = require('../../../src/utils/index')

const Fields = ['username', 'name', 'email', 'password']

function validate(userObject) {
    let Promise = new Promise((resolve) => {
        let flag = Fields.every(field => {
                if (userObject[field] !== undefined) {
                    return true
                } else {
                    return false
                }
            })
            (flag) ? resolve(true) : resolve(false)
    })
    return promise
}

function register(req, res, next) {
    let promise = validate(req.body.data)
    promise.then(flag => {
        if (flag) {
            const {
                username,
                name,
                password,
                email
            } = req.body.data
            if (username === undefined)
                User.register({
                    username,
                    name,
                    email,
                    verified: false,
                    status: 'IA'
                }, password, (err, account) => {
                    if (err) {
                        if (err.name === 'UserExistsError') {
                            res.json({
                                msg: err.name,
                                status: 401
                            });
                        } else {
                            res.json({
                                msg: err,
                                status: 500
                            });
                        }
                    } else {
                        utils.VerificiationEmail(req.body.data, (v) => {
                            if (v === 0) {
                                res.json({
                                    error: 'server_error'
                                })
                            } else {
                                res.json({
                                    status: 200,
                                    mailsent: 1
                                })
                            }
                        })
                        winslog.log({
                            level: 'info',
                            message: req.body.username + "is the new register user"
                        });
                    }
                });
        } else {
            res.json({
                error: 'missing_parameters'
            })
        }
    })
}

module.exports = register