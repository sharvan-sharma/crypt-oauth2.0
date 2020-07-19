const {Forms, Projects} = require('../../../src/config/models') 
const { isUrl } = require('../../../src/utils/validations')
const querystring = require('querystring');


const clientIdMW = (req,res,next) => {
    const {client_id} = req.query

    Forms.findOne({client_id}, (err, form) => {
            if (err) {
                res.json({
                    status:500,
                    error: 'Server_Error',
                    error_description: 'Error occured while processing this Request',
                    error_uri: process.env.ERROR_URI
                })
            } else if (form){
                req.body.form = form.toObject()
                next()
            }else{
                res.json({
                    status:401,
                    error: 'Unrecognised_Client',
                    error_description: 'No Client is Registered With this Client Id',
                    error_uri: process.env.ERROR_URI
                })
            }
    })
}

const redirectUriMW = ()=>{
    const {redirect_uri} = req.query

    if(redirect_uri === undefined || !isUrl(redirect_uri)){
        res.json({
            status:401,
            error: 'Invalid_Redirect_URI',
            error_description: 'redirect_uri mentioned in request is invalid',
            error_uri: process.env.ERROR_URI
        })
    }else{
        const exist =  req.body.form.redirect_uris.some(ele => ele.uri === redirect_uri)
        if(exist) next()
        else{
            res.json({
                status:401,
                error: 'Invalid_Redirect_URI',
                error_description: 'redirect_uri mentioned in request doesnot match any registered uris',
                error_uri: process.env.ERROR_URI
            })
        }
    }    
}

const scopesMW = async (req,res,next)=>{
    const {scope} = req.query
    try{
        const project = await Projects.findOne({_id:req.body.form.project_id})

        const valid = scope.split(',').every(ele => project.scopes.includes(ele))

        if(valid){
            next()
        }else{
            const urlstring = querystring.stringify({
                error: 'Invalid_Scope',
                error_description: 'Scope defined in Request is either Invalid or Unassigned',
                error_uri: process.env.ERROR_URI,
                state:(req.body.state !== undefined)?req.body.state:null
            })
            res.status(302).redirect(req.body.redirect_uri+urlstring)
        }

    }catch{
        res.json({
                status:500,
                error: 'Server_error',
                error_description: 'something went wrong',
            })
    }

}

const responseTypeMW = (req,res,next) => {
    const {response_type} = req.query
    if(response_type !== 'code'){
         const urlstring = querystring.stringify({
            error: 'Invalid_Response_Type',
            error_description: 'Response type mentioned in the request is invalid',
            error_uri: process.env.ERROR_URI,
            state:(req.body.state !== undefined)?req.body.state:null
        })
        res.status(302).redirect(req.body.redirect_uri+urlstring)
    }else{
        next()
    }
}

const codeChallengeMW = (req,res,next) => {
    const {code_challenge ,code_challenge_method} = req.query
    if(code_challenge === undefined) next()
    else{
        if(code_challenge_method === undefined || !['S256','plain'].includes(code_challenge_method)){
            const urlstring = querystring.stringify({
                error: 'invalid_code_challenge_method',
                error_description: 'code challenge method is undefined or unsupported .S256 and plain are the only code challenge method suppprted',
                error_uri: process.env.ERROR_URI,
                state:(req.body.state !== undefined)?req.body.state:null
            })
            res.status(302).redirect(req.body.redirect_uri+urlstring)
        }else{
            next()
        }
    }
}

module.exports = {
    clientIdMW,
    redirectUriMW,
    scopesMW,
    responseTypeMW,
    codeChallengeMW
}