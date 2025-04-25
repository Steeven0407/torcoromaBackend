import dotenv from 'dotenv';
import db from './db';

dotenv.config();

import express from 'express'
import partidas from './routes/partidas.routes.js'
import index from './routes/index.routes.js'
import eventos from './routes/eventosNoticias.routes.js'
import gruposParroquiales from './routes/gruposparroquiales.routes.js'

import cors from 'cors'
import multer from 'multer';
const cloudinary = require('cloudinary').v2;


const app = express()

app.use('/uploads', express.static('uploads'));

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173']
}))
app.use(express.urlencoded({ extended: true }));

// Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración de multer para almacenar en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Endpoint para subir la imagen para eventos p
app.post('/api/eventos', upload.single('imagen'), async (req, res) => {
    const { nombre, hora, descripcion } = req.body;  
    const file = req.file;  
  
    if (!file) return res.status(400).send('No se ha subido ninguna imagen');  
  
    try {
      // Subir la imagen a Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'EventosP',  // Carpeta en Cloudinary donde se guardarán las imágenes de eventos
        },
        (error, result) => {
          if (error) return res.status(500).send(error);  
  
          // Si la imagen se sube correctamente, inserta los datos en la base de datos
          db.query(
            'INSERT INTO eventosparroquiales (nombre, hora, descripcion, imagen) VALUES (?, ?, ?, ?)',
            [nombre, hora, descripcion, result.secure_url],
            (err, results) => {
              if (err) return res.status(500).send(err);
              
              // Obtener el ID del evento recién insertado
              const id = results.insertId;
              
              // Devolver el evento completo incluyendo su ID
              res.status(200).send({ 
                id, 
                nombre, 
                hora, 
                descripcion, 
                imagen: result.secure_url,
                message: 'Evento creado exitosamente' 
              });
            }
          );
        }
      );
  
      // Finalizar la carga de la imagen
      uploadStream.end(file.buffer);
    } catch (err) {
      res.status(500).send(err.message);
    }
});

// Ruta para obtener todos los eventos
app.get('/api/eventos', (req, res) => {
    db.query('SELECT * FROM eventosparroquiales', (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(results);
    });
});

// Ruta para obtener un evento específico
app.get('/api/eventos/:id', (req, res) => {
    const id = req.params.id;
    
    db.query('SELECT * FROM eventosparroquiales WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Evento no encontrado');
        res.status(200).send(results[0]);
    });
});


// Editar evento
app.put('/api/eventos/:id', upload.single('imagen'), async (req, res) => {
    const { nombre, hora, descripcion } = req.body;
    const id = req.params.id;
    const file = req.file;
    
    try {
        // Si se envía una nueva imagen, subirla a Cloudinary
        if (file) {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'EventosP',
                },
                (error, result) => {
                    if (error) return res.status(500).send(error);
                    
                    // Actualizar el evento con la nueva URL de imagen
                    db.query(
                        'UPDATE eventosparroquiales SET nombre = ?, hora = ?, descripcion = ?, imagen = ? WHERE id = ?',
                        [nombre, hora, descripcion, result.secure_url, id],
                        (err) => {
                            if (err) return res.status(500).send(err);
                            
                            // Devolver el evento actualizado
                            res.status(200).send({
                                id,
                                nombre,
                                hora,
                                descripcion,
                                imagen: result.secure_url,
                                message: 'Evento actualizado exitosamente'
                            });
                        }
                    );
                }
            );
            
            uploadStream.end(file.buffer);
        } else {
            // Si no hay nueva imagen, solo actualizar los otros campos
            db.query(
                'UPDATE eventosparroquiales SET nombre = ?, hora = ?, descripcion = ? WHERE id = ?',
                [nombre, hora, descripcion, id],
                (err) => {
                    if (err) return res.status(500).send(err);
                    
                    // Obtener el evento actualizado para devolverlo
                    db.query('SELECT * FROM eventosparroquiales WHERE id = ?', [id], (err, results) => {
                        if (err) return res.status(500).send(err);
                        if (results.length === 0) return res.status(404).send('Evento no encontrado');
                        res.status(200).send({
                            ...results[0],
                            message: 'Evento actualizado exitosamente'
                        });
                    });
                }
            );
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// eliminarevento
app.delete('/api/eventos/:id', (req, res) => {
    const id = req.params.id;

    try {
        db.query('SELECT imagen FROM eventosparroquiales WHERE id = ?', [id], (err, results) => {
            if (err) return res.status(500).send(err);
            if (results.length === 0) return res.status(404).send('Evento no encontrado');

            // Eliminar la imagen de Cloudinary
            const publicId = imageUrl.split('/').pop().split('.')[0];
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) return res.status(500).send(error);

                // Eliminar el evento de la base de datos
                db.query('DELETE FROM eventosparroquiales WHERE id = ?', [id], (err) => {
                    if (err) return res.status(500).send(err);
                    res.status(200).send({ message: 'Evento eliminado exitosamente' });
                });
            });
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.use(partidas)
app.use(index)
app.use(eventos)
app.use("/gruposParroquiales", gruposParroquiales)


app.use((req, res, next) => {
    res.status(404).json({
        mesagge: 'El endpoint no fue encontrado'
    })
})

export default app