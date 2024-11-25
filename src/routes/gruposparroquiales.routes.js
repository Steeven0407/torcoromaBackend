import { Router } from "express";
import { buscarGrupoParroquial, publicarGrupoParroquial } from '../controllers/gruposParroquiales.controllers.js'
const router = Router()

router.get('/buscarGrupoParroquial', buscarGrupoParroquial);
router.post('/publicarGrupoParroquial', publicarGrupoParroquial);

export default router