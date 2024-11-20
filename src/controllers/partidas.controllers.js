import { pool, } from "../db.js";
import { SECRET } from '../config.js'
import databaseError from "../middlewares/error.js";
import pkg from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from "express";
const bcrypt = pkg;

/*
Ejemplo de body:
{
    "libro": 123,
    "folio": 31245,
    "numero": 2134,
    "usuarioSubida": 1,
    "tipo": 1,
    "nombre_esposo": "Juan Pérez",
    "nombre_esposa": "María López",
    "parroquia": "Parroquia San José",
    "dia_matrimonio": "2024-11-15",
    "presbitero": "Padre Francisco González",
    "nombre_padre_esposo": "Carlos Pérez",
    "nombre_madre_esposo": "Ana Martínez",
    "lugar_bautizo_esposo": "Iglesia La Merced",
    "ciudad_bautizo_esposo": "Guatemala",
    "fecha_bautizo_esposo": "1990-05-20",
    "nombre_padre_esposa": "Luis López",
    "nombre_madre_esposa": "Rosa Díaz",
    "lugar_bautizo_esposa": "Catedral Metropolitana",
    "ciudad_bautizo_esposa": "Ciudad de México",
    "fecha_bautizo_esposa": "1992-07-14",
    "Testigo": "Pedro Hernández",
    "Nota_marginal": 1,
    "Fecha_expedicion": "2024-11-18",
    "Imagen": "https://example.com/images/acta_matrimonio.jpg"
}
*/
export const postPartidaMatrimonio = async (req, res) => {
    try {
        const {
            libro,
            folio,
            numero,
            usuarioSubida,
            tipo,
            nombre_esposo,
            nombre_esposa,
            parroquia,
            dia_matrimonio,
            presbitero,
            nombre_padre_esposo,
            nombre_madre_esposo,
            lugar_bautizo_esposo,
            ciudad_bautizo_esposo,
            fecha_bautizo_esposo,
            nombre_padre_esposa,
            nombre_madre_esposa,
            lugar_bautizo_esposa,
            ciudad_bautizo_esposa,
            fecha_bautizo_esposa,
            Testigo,
            Nota_marginal,
            Fecha_expedicion,
            Imagen
        } = req.body;
        const connection = await pool.getConnection();
        try {
            // Iniciar la transacción
            await connection.beginTransaction();

            // Primera consulta: insertar en `partida`
            const [result] = await connection.query(
                `INSERT INTO partida (IDpartida, libro, folio, numero, usuarioSubida, tipo) VALUES (?, ?, ?, ?, ?, ?)`,
                [numero, libro, folio, numero, usuarioSubida, tipo]
            );

            // Obtener el ID de la primera inserción
            const idPartida = result.insertId;

            // Segunda consulta: insertar detalles adicionales en `partida`
            await connection.query(
                `INSERT INTO Partida_de_matrimonio (
                    idPartida, 
                    nombre_esposo, 
                    nombre_esposa, 
                    parroquia, 
                    dia_matrimonio, 
                    presbitero, 
                    nombre_padre_esposo, 
                    nombre_madre_esposo, 
                    lugar_bautizo_esposo, 
                    ciudad_bautizo_esposo, 
                    fecha_bautizo_esposo, 
                    nombre_padre_esposa, 
                    nombre_madre_esposa, 
                    lugar_bautizo_esposa, 
                    ciudad_bautizo_esposa, 
                    fecha_bautizo_esposa, 
                    Testigo, 
                    Nota_marginal, 
                    Fecha_expedicion, 
                    Imagen
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    idPartida,
                    nombre_esposo,
                    nombre_esposa,
                    parroquia,
                    dia_matrimonio,
                    presbitero,
                    nombre_padre_esposo,
                    nombre_madre_esposo,
                    lugar_bautizo_esposo,
                    ciudad_bautizo_esposo,
                    fecha_bautizo_esposo,
                    nombre_padre_esposa,
                    nombre_madre_esposa,
                    lugar_bautizo_esposa,
                    ciudad_bautizo_esposa,
                    fecha_bautizo_esposa,
                    Testigo,
                    Nota_marginal,
                    Fecha_expedicion,
                    Imagen
                ]
            );

            // Confirmar transacción
            await connection.commit();
            console.log('Transacción completada con éxito.');
            res.status(200).json({
                message: "Partida insertada correctamente"
            })

        } catch (error) {
            // En caso de error, revertir transacción
            await connection.rollback();
            console.error('Error en la transacción, se ha revertido:', error);
        }
    } catch (error) {
        console.error('Error al subir la partida:', error);

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
            "Error interno del servidor al realizar la subida",
            error.code || error.errno
        );
        return res.status(500).json({ message: dbError.message });
    }
}


//Endpoints de busqueda

export const buscarPartidaMatrimonio = async (req, res) => {
    try {
        const { nombre_esposo, nombre_esposa, dia_matrimonio } = req.body

        const [result] = await pool.query(`SELECT * FROM Partida_de_matrimonio WHERE nombre_esposo = ? and nombre_esposa = ? and dia_matrimonio = ?`, [nombre_esposo, nombre_esposa, dia_matrimonio])

        if (result.length > 0) {
            res.status(200).json({
                message: "Se encontro una partida en el sistema"
            })
        } else {
            res.status(404).json({
                message: "No se encontro ninguna partida en el sistema"
            })
        }

    } catch (error) {
        console.error('Error al subir la partida:', error);
        // Manejo genérico de otros errores de base de datos
        const dbError = new databaseError(
            "Error interno del servidor al realizar la consulta",
            error.code || error.errno
        );
        return res.status(500).json({ message: dbError.message });
    }
}