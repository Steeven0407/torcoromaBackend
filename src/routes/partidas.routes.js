import { Router } from "express";
import { postPartidaMatrimonio, buscarPartidaMatrimonio, buscarPartidaBautismo, buscarPartidaConfirmacion, postPartidaBautismo, postPartidaConfirmacion } from '../controllers/partidas.controllers.js'
const router = Router()

router.post('/postPartidaMatrimonio', postPartidaMatrimonio);//Subir partida de matrimonio
router.post('/postPartidaBautismo', postPartidaBautismo);//Subir partida de bautismo    
router.post('/postPartidaConfirmacion', postPartidaConfirmacion);//Subir partida de confirmacion    
router.post('/buscarPartidaMatrimonio', buscarPartidaMatrimonio);
router.post('/buscarPartidaBautismo', buscarPartidaBautismo);
router.post('/buscarPartidaConfirmacion', buscarPartidaConfirmacion);

export default router