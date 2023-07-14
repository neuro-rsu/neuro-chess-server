import type { Router } from "express";

import express from 'express'

const router: Router = express.Router()

import signUpRoutes from '../sign-up/sign-up.routes.js'

router.use('/signup', signUpRoutes)

export default router