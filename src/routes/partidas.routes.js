import { Router } from "express";
import { postPartidaGeneral } from '../controllers/partidas.controllers.js'
const router = Router()

router.post('/postPartidaGeneral', postPartidaGeneral);

export default router