const express = require('express'),
    router = express.Router(),
    LoginController = require('./login.controller'),
    LoginService = require('./login.service')

router.use(async (req, res, next) => {
    let data = await LoginService.getLogin()
    if (data) {
        req.hosts = data
        next()
    } else {
        return res
            .status(500)
            .send({ message: 'Error while getting users' })
    }
})

router
    .route('/')
    .get(LoginController.getLogin)
    .post(LoginController.createLogin)
//.put(LoginController.updateLogin)
//.delete(LoginController.deleteLogin)

export default router