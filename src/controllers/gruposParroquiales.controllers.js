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

/*
ejemplo de endpoint:
{
"Documento": "12331451",
"nombre": "juan maldonado",
"apellido": "serrano perez",
"grupo": 1005054187, 
"fecha_de_nacimiento": "2023-10-01", 
"estado": 1, 
"imagen" : "esto es una imagen"
}
*/
export const publicarAgentePastoral = async (req, res) => {
  try {

    const { Documento, nombre, apellido, grupo, fecha_de_nacimiento, estado, imagen } = req.body

    const [data] = await pool.query(
      `INSERT INTO agentes_de_pastoral (Documento,  nombre, apellido, grupo, fecha_de_nacimiento, estado, imagen) VALUES (?, ?, ?, ?, ?,?,?)`,
      [Documento, nombre, apellido, grupo, fecha_de_nacimiento, estado, imagen]
    );

    res.status(200).json({
      message: "Se ha registrado el agente de pastoral correctamente",
      data: data[0],
      resultado: { Documento, nombre, apellido, grupo, fecha_de_nacimiento, estado, imagen }
    });


  } catch (error) {
    console.error('Error al subir agente de pastoral:', error);

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


export const editarAgentePastoral = async (req, res) => {
  try {
    const { Documento } = req.params;
    const { nombre, apellido, grupo, fecha_de_nacimiento, estado, imagen } = req.body;

    const [result] = await pool.query(
      `UPDATE agentes_de_pastoral SET nombre = ?, apellido = ?, grupo = ?, fecha_de_nacimiento = ?, estado = ?, imagen = ? WHERE Documento = ?`,
      [nombre, apellido, grupo, fecha_de_nacimiento, estado, imagen, Documento]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No se encontró el agente de pastoral con el documento proporcionado" });
    }

    res.status(200).json({
      message: "Agente de pastoral actualizado correctamente",
      resultado: { Documento, nombre, apellido, grupo, fecha_de_nacimiento, estado, imagen }
    });
  } catch (error) {
    console.error('Error al editar agente de pastoral:', error);
    return res.status(500).json({ message: "Error interno del servidor al actualizar el agente de pastoral" });
  }
};


export const buscarAgentePastoral = async (req, res) => {
  try {
    const { Documento } = req.params;

    const [rows] = await pool.query(
      `SELECT * FROM agentes_de_pastoral WHERE Documento = ?`,
      [Documento]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encontró el agente de pastoral con el documento proporcionado" });
    }

    res.status(200).json({
      message: "Agente de pastoral encontrado",
      resultado: rows[0]
    });
  } catch (error) {
    console.error('Error al buscar agente de pastoral:', error);
    return res.status(500).json({ message: "Error interno del servidor al buscar el agente de pastoral" });
  }
};