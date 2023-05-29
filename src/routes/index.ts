import type { Router } from "express";

const express = require('express'),
    router: Router = express.Router(),
    loginRoutes = require('../login/login.routes')

router.use('/login', loginRoutes)


export = router