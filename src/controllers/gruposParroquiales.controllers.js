import { pool, } from "../db.js";
import databaseError from "../middlewares/error.js";

/*
ejemplo de body para publicarGrupoParroquial    
{
"Documento":12111345,
 "coordinador": "eugenio derves", 
 "hora": "12 pm",
 "lugar_Encuentro": "Salon sur", 
 "imagen" :"Estoesunlink"
}
*/
export const publicarGrupoParroquial = async (req, res) => {
    try {

        const { Documento, coordinador, hora, lugar_Encuentro, imagen } = req.body

        const [data] = await pool.query(
            `INSERT INTO grupoparroquiales (Documento, coordinador, hora, lugar_Encuentro, imagen) VALUES (?, ?, ?, ?, ?)`,
            [Documento, coordinador, hora, lugar_Encuentro, imagen]
        );

        res.status(200).json({
            message: "Se ha registrado el grupo parroquial correctamente",
            data: data[0],
            resultado: { Documento, coordinador, hora, lugar_Encuentro, imagen }
        });


    } catch (error) {
        console.error('Error al subir grupo parroquial:', error);

        // Aquí capturamos el error específico de clave duplicada.
        if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
            const dbError = new databaseError(
                "El documento ya existe en la base de datos.",
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

export const buscarGrupoParroquial = async (req, res) => {
    try {
        const [data] = await pool.query(`SELECT coordinador, hora, lugar_Encuentro, imagen FROM grupoparroquiales`);

        if (data.length > 0) {
            return res.status(200).json({
                message: "Se encontraron estos grupos parroquiales en el sistema",
                resultado: data
            });
        }

    } catch (error) {
        console.error('Error al subir grupo parroquial:', error);

        // Aquí capturamos el error específico de clave duplicada.
        if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
            const dbError = new databaseError(
                "El documento ya existe en la base de datos.",
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