import { Router } from "express";
import { pool } from '../db.js'
import { postUsuarios } from '../controllers/index.controllers.js'

const router = Router()

router.get('/ping', async (req, res) => {
    const [resultado] = await pool.query('select 1 + 5 AS resultado')
    res.json(resultado[0])
});

router.post('/insertarUsuario', postUsuarios)

export default router