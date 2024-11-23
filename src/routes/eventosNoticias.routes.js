import { Router } from "express";
import { buscarNoticia, buscarEvento } from '../controllers/eventos.controllers.js'
const router = Router()

router.get('/buscarNoticia', buscarNoticia);
router.get('/buscarEvento', buscarEvento);


export default router