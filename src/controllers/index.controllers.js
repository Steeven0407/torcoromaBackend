import { pool } from "../db.js";
import databaseError from "../middlewares/error.js";


export const postUsuarios = async (req, res) => {
    try {
        const { usuario, contrasena, cedula, fechaExpedicion } = req.body

        const [cedulaDoble] = await pool.query('SELECT * FROM usuario WHERE cedula = ?', [cedula])

        if (cedulaDoble.length > 0) {
            return res.status(404).json({
                Message: "Esta cedula ya se encuentra registrada en el sistema"
            })
        }

        await pool.query('INSERT INTO usuario (tipo, usuario, contrasena, cedula, fechaExpedicion) VALUES (?,?,?,?,?)',
            ["particular", usuario, contrasena, cedula, fechaExpedicion])
        res.status(200).json({
            message: "Usuario insertado",
            respuesta: { usuario, contrasena, cedula, fechaExpedicion }
        })
    } catch (error) {
        console.error('Error al subir usuarios:', error);

        // Aquí capturamos el error específico de clave duplicada.
        if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
            const dbError = new databaseError(
                "El código de usuario ya existe en la base de datos.",
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
};