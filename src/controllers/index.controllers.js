import { pool, } from "../db.js";
import { SECRET } from '../config.js'
import databaseError from "../middlewares/error.js";
import pkg from 'bcryptjs';
import jwt from 'jsonwebtoken';
const bcrypt = pkg;



export const postUsuarios = async (req, res) => {
    try {
        const { usuario, contrasena, cedula, fechaExpedicion, nombre } = req.body

        const [cedulaDoble] = await pool.query('SELECT * FROM usuario WHERE cedula = ?', [cedula])
        const [usuarioDoble] = await pool.query('SELECT * FROM usuario WHERE usuario=?', [usuario])

        if (cedulaDoble.length > 0) {
            return res.status(404).json({
                Message: "Esta cedula ya se encuentra registrada en el sistema"
            })
        }

        if (usuarioDoble.length > 0) {
            return res.status(404).json({
                Message: "Este usuario ya existe"
            })
        }

        const contrasenaEncryptada = bcrypt.hashSync(contrasena, 10)

        await pool.query('INSERT INTO usuario (tipo, usuario, contrasena, cedula, fechaExpedicion, nombre) VALUES (?,?,?,?,?,?)',
            ["particular", usuario, contrasenaEncryptada, cedula, fechaExpedicion, nombre])
        res.status(200).json({
            message: "Usuario insertado",
            respuesta: { usuario, cedula, fechaExpedicion, nombre }
        })
    } catch (error) {
        console.error('Error al subir usuarios:', error);

        // Aquí capturamos el error específico de clave duplicada.
        if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
            const dbError = new databaseError(
                "El id de usuario ya existe en la base de datos.",
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


export const loginUsuarios = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body


        const [DatosBd] = await pool.query('SELECT * FROM usuario WHERE usuario = ?', [usuario])
        const valido = bcrypt.compareSync(contrasena, DatosBd[0].contrasena)

        const token = jwt.sign({ id: DatosBd[0].IDusuario, username: DatosBd[0].usuario }, SECRET, {
            expiresIn: '1h'
        })

        if (valido) {
            res.status(200).json({
                message: "Usuario encontrado",
                usuario: usuario,
                token: token
            })

        } else {
            res.status(404).json({
                message: "Contraseña no valida"
            })
        }


    } catch (error) {
        console.log("Error al loggearse:", error);
        // Manejo genérico de otros errores de base de datos
        const dbError = new databaseError(
            "Error interno del servidor al realizar la consulta",
            error.code || error.errno
        );
        return res.status(500).json({ message: dbError.message });


    }
} 