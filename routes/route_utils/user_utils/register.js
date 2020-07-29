const User = require('../../../src/config/models/user.model')
const userpassport = require('../../../src/config/userPassport')
const utils = require('../../../src/utils/index')
const winslog =  require('../../../src/config/winston')

const Fields = ['username', 'name', 'email', 'password']

function validate(userObject) {
    let promise = new Promise((resolve) => {
        let flag = Fields.every(field => {
            if (userObject[field] !== undefined) {
                return true
            } else {
                return false
            }
        })
        resolve(flag)
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
                email,
                transaction_id
            } = req.body.data
            User.register({
                username,
                name,
                email,
                verified: false,
                status: 'IA',
                transaction_id:transaction_id || null
            }, password, function(err, account){
                if(err){
                    if(err.name === 'UserExistsError'){
                        res.json({msg:err.name,status:401});
                    }else{
                        res.json({msg:err,status:500});
                    } 
                }else{
                    const userObject = {...req.body.data,id:account._id}
                    utils.VerificationEmail(userObject, (v) => {
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
                        message: req.body.data.username + "is the new register user"
                    });
                }
            });
        } else {
            res.json({
                error: 'missing_parameters'
            })
        }
    }).catch(err=>{
        res.json({status:423})
    })
}

module.exports = register
