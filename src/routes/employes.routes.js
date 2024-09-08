import { Router } from "express";
import { getPruebaEmpleados } from '../controllers/empleados.controllers.js'
const router = Router()

router.get('/rutaEmpleados', getPruebaEmpleados);

export default router