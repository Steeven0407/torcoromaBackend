import { pool, } from "../db.js";
import databaseError from "../middlewares/error.js";
import pkg from 'bcrypt';
const bcrypt = pkg;


export const buscarNoticia = async (req, res) => {
    try {

        const [result] = await pool.query(`SELECT nombre, descripcion, imagen FROM cronograma WHERE EventoComunidad = 0`)

        if (result.length > 0) {
            res.status(200).json({
                message: "Se encontraron estas noticias en el sistema",
                resultado: result
            })
        } else {
            res.status(404).json({
                message: "No se encontro ninguna noticia en el sistema"
            })
        }

    } catch (error) {
        console.error('Error al buscar noticia:', error);
        // Manejo genérico de otros errores de base de datos
        const dbError = new databaseError(
            "Error interno del servidor al realizar la consulta",
            error.code || error.errno
        );
        return res.status(500).json({ message: dbError.message });
    }
}

export const buscarEvento = async (req, res) => {
    try {

        const [result] = await pool.query(`SELECT nombre,hora,fecha, descripcion,intencion, imagen FROM cronograma WHERE EventoComunidad = 1`)

        if (result.length > 0) {
            res.status(200).json({
                message: "Se encontraron estos eventos en el sistema",
                resultado: result
            })
        } else {
            res.status(404).json({
                message: "No se encontro ningun evento en el sistema"
            })
        }

    } catch (error) {
        console.error('Error al buscar evento:', error);
        // Manejo genérico de otros errores de base de datos
        const dbError = new databaseError(
            "Error interno del servidor al realizar la consulta",
            error.code || error.errno
        );
        return res.status(500).json({ message: dbError.message });
    }
}