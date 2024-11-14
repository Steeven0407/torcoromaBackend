import { pool, } from "../db.js";
import { SECRET } from '../config.js'
import databaseError from "../middlewares/error.js";
import pkg from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from "express";
const bcrypt = pkg;


export const postPartidaGeneral = async (req, res) => {
    try {
        const { libro, folio, numero, usuarioSubida, tipo } = req.body

        await pool.query(`INSERT INTO partida (IDpartida, libro, folio, numero, usuarioSubida, tipo) VALUES (?,?,?,?,?,?)`, [numero, libro, folio, numero, usuarioSubida, tipo])
        res.status(200).json({
            mesagge: "Se inserto la partida correctamente",
            datos: { libro, folio, numero, usuarioSubida, tipo }
        })
    } catch (error) {
        console.error('Error al subir usuarios:', error);

        // Aquí capturamos el error específico de clave duplicada.
        if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
            const dbError = new databaseError(
                "El id de la partida ya existe en la base de datos.",
                error.code || error.errno
            );
            return res.status(409).json({ message: dbError.message });
        }

        // Manejo genérico de otros errores de base de datos
        const dbError = new databaseError(
            "Error interno del servidor al realizar la consulta",
            error.code || error.errno
        );
        return res.status(500).json({ message: dbError.message });
    }
}