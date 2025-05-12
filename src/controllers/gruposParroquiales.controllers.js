import { pool } from '../db.js';
import cloudinary from 'cloudinary';
import databaseError from '../middlewares/error.js'; // Para manejar errores si ya lo usas

export const crearEvento = async (req, res) => {
  const { nombre, hora, descripcion } = req.body;
  const file = req.file;

  if (!file) return res.status(400).send('No se ha subido ninguna imagen');

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'EventosP' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    const [data] = await pool.query(
      'INSERT INTO eventosparroquiales (nombre, hora, descripcion, imagen) VALUES (?, ?, ?, ?)',
      [nombre, hora, descripcion, result.secure_url]
    );

    res.status(200).json({
      id: data.insertId,
      nombre,
      hora,
      descripcion,
      imagen: result.secure_url,
      message: 'Evento creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear evento parroquial:', error);
    const dbError = new databaseError('Error al crear el evento parroquial', error.code || error.errno);
    res.status(500).json({ message: dbError.message });
  }
};

export const obtenerEventos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM eventosparroquiales');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ message: 'Error al obtener eventos parroquiales' });
  }
};

export const obtenerEventoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM eventosparroquiales WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Evento no encontrado' });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener evento por ID:', error);
    res.status(500).json({ message: 'Error interno al obtener el evento' });
  }
};

export const editarEvento = async (req, res) => {
  const { id } = req.params;
  const { nombre, hora, descripcion } = req.body;
  const file = req.file;

  try {
    if (file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'EventosP' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });

      await pool.query(
        'UPDATE eventosparroquiales SET nombre = ?, hora = ?, descripcion = ?, imagen = ? WHERE id = ?',
        [nombre, hora, descripcion, result.secure_url, id]
      );

      res.status(200).json({
        id,
        nombre,
        hora,
        descripcion,
        imagen: result.secure_url,
        message: 'Evento actualizado exitosamente',
      });
    } else {
      await pool.query(
        'UPDATE eventosparroquiales SET nombre = ?, hora = ?, descripcion = ? WHERE id = ?',
        [nombre, hora, descripcion, id]
      );

      const [rows] = await pool.query('SELECT * FROM eventosparroquiales WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ message: 'Evento no encontrado' });

      res.status(200).json({
        ...rows[0],
        message: 'Evento actualizado exitosamente',
      });
    }
  } catch (error) {
    console.error('Error al editar evento:', error);
    res.status(500).json({ message: 'Error al actualizar evento parroquial' });
  }
};

export const eliminarEvento = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT imagen FROM eventosparroquiales WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Evento no encontrado' });

    const imageUrl = rows[0].imagen;
    const publicId = imageUrl.split('/').pop().split('.')[0];

    await cloudinary.uploader.destroy(publicId);

    await pool.query('DELETE FROM eventosparroquiales WHERE id = ?', [id]);

    res.status(200).json({ message: 'Evento eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({ message: 'Error interno al eliminar el evento' });
  }
};
