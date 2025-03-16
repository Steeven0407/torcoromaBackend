import { Router } from "express";
import { buscarGrupoParroquial, publicarGrupoParroquial, publicarAgentePastoral, editarAgentePastoral, buscarAgentePastoral, eliminarAgentePastoral } from '../controllers/gruposParroquiales.controllers.js'
const router = Router()

router.get('/buscarGrupoParroquial', buscarGrupoParroquial);
router.post('/publicarGrupoParroquial', publicarGrupoParroquial);
router.post('/publicarAgentePastoral', publicarAgentePastoral);
router.post('/editarAgentePastoral', editarAgentePastoral);
router.get('/buscarAgentePastoral', buscarAgentePastoral);
router.get('/eliminarAgentePastoral', eliminarAgentePastoral);

export default router