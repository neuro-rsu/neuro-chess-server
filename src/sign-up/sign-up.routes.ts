import type { Express, Router, Request, Response, NextFunction} from 'express'

import express from 'express'

import signUpService from './sign-up.service.js'

import signUpController from './sign-up.controller.js'

const router: Router = express.Router()

import type RequestCustom from 'my'

// import MyName, {MyClass} from 'my2'

// class My implements MyName.MyClass {
//     username: string
//     password: string
//     constructor() {

//     }
// }

// const a: MyClass = new My()

router.use(async (req: RequestCustom, res: Response, next: NextFunction) => {
    signUpService.checkMethod(req)
        .then (() => next())
        .catch(next)
})


router
    .route('/')
    //.get(loginController.getLogin)
    .post(signUpController.createUser)
//.put(LoginController.updateLogin)
//.delete(LoginController.deleteLogin)

router.use(function(err: any, req: RequestCustom, res: Response, next: NextFunction) {
    res.status(err.status || 500)
    .send(err);
});

export default router