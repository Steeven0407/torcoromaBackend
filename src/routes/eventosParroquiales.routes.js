import { Router } from 'express';
import multer from 'multer';
import {
  crearEvento,
  obtenerEventos,
  obtenerEventoPorId,
  editarEvento,
  eliminarEvento
} from '../controllers/eventosParroquiales.controller.js';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Crear evento con imagen
router.post('/eventos', upload.single('imagen'), crearEvento);
router.get('/eventos', obtenerEventos);
router.get('/eventos/:id', obtenerEventoPorId);
router.put('/eventos/:id', upload.single('imagen'), editarEvento);
router.delete('/eventos/:id', eliminarEvento);

export default router;
