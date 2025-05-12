import { db } from '../db.js';
import cloudinary from 'cloudinary';

export const crearEvento = async (req, res) => {
  const { nombre, hora, descripcion } = req.body;
  const file = req.file;

  if (!file) return res.status(400).send('No se ha subido ninguna imagen');

  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'EventosP',
      },
      (error, result) => {
        if (error) return res.status(500).send(error);

        db.query(
          'INSERT INTO eventosparroquiales (nombre, hora, descripcion, imagen) VALUES (?, ?, ?, ?)',
          [nombre, hora, descripcion, result.secure_url],
          (err, results) => {
            if (err) return res.status(500).send(err);

            const id = results.insertId;
            res.status(200).send({
              id,
              nombre,
              hora,
              descripcion,
              imagen: result.secure_url,
              message: 'Evento creado exitosamente',
            });
          }
        );
      }
    );

    uploadStream.end(file.buffer);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const obtenerEventos = (req, res) => {
  db.query('SELECT * FROM eventosparroquiales', (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(results);
  });
};

export const obtenerEventoPorId = (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM eventosparroquiales WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send('Evento no encontrado');
    res.status(200).send(results[0]);
  });
};

export const editarEvento = async (req, res) => {
  const { nombre, hora, descripcion } = req.body;
  const id = req.params.id;
  const file = req.file;

  try {
    if (file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'EventosP',
        },
        (error, result) => {
          if (error) return res.status(500).send(error);

          db.query(
            'UPDATE eventosparroquiales SET nombre = ?, hora = ?, descripcion = ?, imagen = ? WHERE id = ?',
            [nombre, hora, descripcion, result.secure_url, id],
            (err) => {
              if (err) return res.status(500).send(err);

              res.status(200).send({
                id,
                nombre,
                hora,
                descripcion,
                imagen: result.secure_url,
                message: 'Evento actualizado exitosamente',
              });
            }
          );
        }
      );

      uploadStream.end(file.buffer);
    } else {
      db.query(
        'UPDATE eventosparroquiales SET nombre = ?, hora = ?, descripcion = ? WHERE id = ?',
        [nombre, hora, descripcion, id],
        (err) => {
          if (err) return res.status(500).send(err);

          db.query('SELECT * FROM eventosparroquiales WHERE id = ?', [id], (err, results) => {
            if (err) return res.status(500).send(err);
            if (results.length === 0) return res.status(404).send('Evento no encontrado');
            res.status(200).send({
              ...results[0],
              message: 'Evento actualizado exitosamente',
            });
          });
        }
      );
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const eliminarEvento = (req, res) => {
  const id = req.params.id;

  try {
    db.query('SELECT imagen FROM eventosparroquiales WHERE id = ?', [id], (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) return res.status(404).send('Evento no encontrado');

      const imageUrl = results[0].imagen;
      const publicId = imageUrl.split('/').pop().split('.')[0];

      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return res.status(500).send(error);

        db.query('DELETE FROM eventosparroquiales WHERE id = ?', [id], (err) => {
          if (err) return res.status(500).send(err);
          res.status(200).send({ message: 'Evento eliminado exitosamente' });
        });
      });
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
