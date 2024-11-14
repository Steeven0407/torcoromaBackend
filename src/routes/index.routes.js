import { Router } from "express";
import { postUsuarios, loginUsuarios } from '../controllers/index.controllers.js'

const router = Router()



router.post('/insertarUsuario', postUsuarios)

router.post('/loginUsuarios', loginUsuarios)

export default router