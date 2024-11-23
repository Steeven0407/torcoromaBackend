import { Router } from "express";
import { postPartidaMatrimonio, buscarPartidaMatrimonio, buscarPartidaBautismo, buscarPartidaConfirmacion } from '../controllers/partidas.controllers.js'
const router = Router()

router.post('/postPartidaMatrimonio', postPartidaMatrimonio);
router.post('/buscarPartidaMatrimonio', buscarPartidaMatrimonio);
router.post('/buscarPartidaBautismo', buscarPartidaBautismo);
router.post('/buscarPartidaConfirmacion', buscarPartidaConfirmacion);

export default router