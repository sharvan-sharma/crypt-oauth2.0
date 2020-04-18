const VerifyLoggedIn = require('./verify.loggedIn')
const CreateProject = require('./createproject')
const AddOrigin = require('./addorigin')
const AddRedirect = require('./addredirect')
const EditOrigin = require('./editorigin')
const EditRedirect = require('./editredirect')
const generateIdAndSecret = require('./generateIdAndSecret')
const EditProjectName = require('./editprojectname')
const DeleteProject = require('./deleteproject')
const DeleteOrigin =  require('./deleteorigin')
const DeleteRedirect = require('./deleteredirect')

module.exports = {
    VerifyLoggedIn,
    CreateProject,
    AddOrigin,
    AddRedirect,
    EditOrigin,
    EditRedirect,
    generateIdAndSecret,
    EditProjectName,
    DeleteOrigin,
    DeleteProject,
    DeleteRedirect
}