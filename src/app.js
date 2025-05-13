import dotenv from 'dotenv';

dotenv.config();

import express from 'express'
import partidas from './routes/partidas.routes.js'
import index from './routes/index.routes.js'
import eventos from './routes/eventosNoticias.routes.js'
import eventosParroquialesRoutes from './routes/eventosParroquiales.routes.js'
import gruposParroquiales from './routes/gruposparroquiales.routes.js'
import { crearEvento } from './controllers/eventosParroquiales.controller.js';

import cors from 'cors'
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';


const app = express()

app.use('/uploads', express.static('uploads'));

app.use(express.json())
app.use(cors({}))
app.use(express.urlencoded({ extended: true }));

// Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });
app.post('/eventos', upload.single('imagen'), crearEvento);


app.use(partidas)
app.use(index)
app.use(eventos)
app.use('/api', eventosParroquialesRoutes)
app.use("/gruposParroquiales", gruposParroquiales)


app.use((req, res, next) => {
    res.status(404).json({
        mesagge: 'El endpoint no fue encontrado'
    })
})

export default app