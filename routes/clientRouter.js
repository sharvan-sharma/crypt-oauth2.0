const express = require('express');
const router = express.Router();
const client = require('./middlewares/client.middlewares')


router.get('/',(req,res) => res.send('client routes'))

router.route('/project/create')
    .post(client.createProject)

router.route('/read/project')
    .post(client.readProject)

router.route('/project/update/name')
    .post(client.projectHelper.validateProjectId,client.projectHelper.updateName)

router.route('/project/upload/logo')
    .post(client.updateProjectLogo)

router.route('/project/update/supportemail')
    .post(client.projectHelper.validateProjectId,client.projectHelper.updateSupportEmail)


router.route('/project/update/scopes')
    .post(client.projectHelper.validateProjectId,client.projectHelper.updateScopes)


router.route('/project/update/links')
    .post(client.projectHelper.validateProjectId,client.projectHelper.updateLinks)


router.route('/form/create')
    .post(client.validateFormReq,client.createForm)

router.route('/form/delete')
    .post(client.deleteForm)

router.route('/form/edit/name')
    .post(client.formHelper.validateFormId,client.formHelper.name)

router.route('/form/edit/reset')
    .post(client.formHelper.validateFormId,client.formHelper.reset)

router.route('/form/edit/add/uri')
    .post(client.formHelper.validateFormId,client.formHelper.addUri)

router.route('/form/edit/remove/uri')
    .post(client.formHelper.validateFormId,client.formHelper.removeUri)

module.exports = router;