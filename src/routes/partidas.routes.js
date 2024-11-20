import { Router } from "express";
import { postPartidaMatrimonio, buscarPartidaMatrimonio } from '../controllers/partidas.controllers.js'
const router = Router()

router.post('/postPartidaMatrimonio', postPartidaMatrimonio);
router.post('/buscarPartidaMatrimonio', buscarPartidaMatrimonio);

export default router