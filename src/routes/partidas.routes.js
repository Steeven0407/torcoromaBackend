import { Router } from "express";
import { postPartidaMatrimonio, buscarPartidaMatrimonio, buscarPartidaBautismo, buscarPartidaConfirmacion, postPartidaBautismo, postPartidaConfirmacion, updatePartidaMatrimonio, updatePartidaConfirmacion, updatePartidaBautismo } from '../controllers/partidas.controllers.js'
const router = Router()

router.post('/postPartidaMatrimonio', postPartidaMatrimonio);//Subir partida de matrimonio
router.post('/postPartidaBautismo', postPartidaBautismo);//Subir partida de bautismo    
router.post('/postPartidaConfirmacion', postPartidaConfirmacion);//Subir partida de confirmacion    
router.post('/buscarPartidaMatrimonio', buscarPartidaMatrimonio);
router.post('/buscarPartidaBautismo', buscarPartidaBautismo);
router.post('/buscarPartidaConfirmacion', buscarPartidaConfirmacion);
router.put('/updatePartidaMatrimonio', updatePartidaMatrimonio);
router.put('/updatePartidaConfirmacion', updatePartidaConfirmacion);
router.put('/updatePartidaBautismo', updatePartidaBautismo);

export default router