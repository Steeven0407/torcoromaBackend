CREATE SCHEMA `torcoromabd` ;

CREATE TABLE `torcoromabd`.`usuario` (
  `IDusuario` INT NOT NULL AUTO_INCREMENT,
  `tipo` VARCHAR(100) NOT NULL,
  `usuario` VARCHAR(100) NOT NULL,
  `contrasena` VARCHAR(100) NOT NULL,
  `cedula` VARCHAR(100) NOT NULL,
  `fechaExpedicion` DATE NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`IDusuario`));

CREATE TABLE `torcoromabd`.`partida` (
    IDpartida INTEGER(100) PRIMARY KEY,
    libro INTEGER(100),
    folio INTEGER(100),
    usuarioSubida INTEGER(100),
    tipo VARCHAR(100),
    FOREIGN KEY (usuarioSubida) REFERENCES usuario(IDusuario)
);

CREATE TABLE `torcoromabd`.`partida_de_matrimonio`(
    IDmatrimonio INTEGER(100) PRIMARY KEY,
    nombre_esposo VARCHAR(300),
    nombre_esposa VARCHAR(300),
    parroquia VARCHAR(300),
    dia_matrimonio DATE,
    presbitero VARCHAR(300),
    nombre_padre_esposo VARCHAR(300),
    nombre_madre_esposo VARCHAR(300),
    lugar_bautizo_esposo VARCHAR(300),
    ciudad_bautizo_esposo VARCHAR(300),
    fecha_bautizo_esposo DATE,
    nombre_padre_esposa VARCHAR(300),
    nombre_madre_esposa VARCHAR(300),
    lugar_bautizo_esposa VARCHAR(300),
    ciudad_bautizo_esposa VARCHAR(300),
    fecha_bautizo_esposa DATE,
    Testigo VARCHAR(300),
    Nota_marginal INTEGER(100),
    Fecha_expedicion DATE,
    Imagen VARCHAR(300),
    FOREIGN KEY (IDmatrimonio) REFERENCES Partida(IDpartida)
);

CREATE TABLE `torcoromabd`.`partidabautismo` (
    IDbautismo INT PRIMARY KEY,
    dia_Bautizo DATE,
    nombre_Bautizado VARCHAR(300),
    parroquia VARCHAR(300),
    parroco VARCHAR(300),
    fecha_Nacimiento DATE,
    nombre_Papa VARCHAR(300),
    nombre_Mama VARCHAR(300),
    abuelo_Materno VARCHAR(300),
    abuela_Materna VARCHAR(300),
    abuelo_Paterno VARCHAR(300),
    abuela_Paterna VARCHAR(300),
    padrino VARCHAR(300),
    madrina VARCHAR(300),
    nota_Marginal VARCHAR(300),
    fecha_Expedicion DATE,
    imagen VARCHAR(300),
    FOREIGN KEY (IDbautismo) REFERENCES partida(IDpartida)
);

CREATE TABLE `torcoromabd`.`partidaconfirmacion` (
    IDconfirmacion INT PRIMARY KEY,
    nombre_Confirmado VARCHAR(300),
    parroquia VARCHAR(300),
    fecha_Confirmacion DATE,
    edad INT,
    lugar_Bautizo VARCHAR(300),
    nombre_Madre VARCHAR(300),
    nombre_Padre VARCHAR(300),
    monseñor VARCHAR(300),
    nota_Marginal VARCHAR(300),
    fecha_Expedicion DATE,
    imagen VARCHAR(300),
    FOREIGN KEY (IDconfirmacion) REFERENCES partida(IDpartida)
);

CREATE TABLE `torcoromabd`.`cronograma` (
    ID VARCHAR(100) PRIMARY KEY,
    nombre VARCHAR(100),
    hora VARCHAR(100),
    fecha DATE,
    intencion VARCHAR(100),
    descripcion VARCHAR(300),
    EventoComunidad INTEGER,
    imagen VARCHAR(100)
);

CREATE TABLE `torcoromabd`.`grupoparroquiales` (
    Documento INTEGER PRIMARY KEY,
    coordinador VARCHAR(100),
    hora VARCHAR(100),
    lugar_Encuentro VARCHAR(100),
    imagen VARCHAR(100)
);

CREATE TABLE `torcoromabd`.`eventosparroquiales` (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100),
    hora VARCHAR(100),
    descripcion VARCHAR(100),
    imagen VARCHAR(100)
);

CREATE TABLE  `torcoromabd`.`Agentes_de_pastoral` (
    Documento INTEGER PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    grupo INTEGER,
    fecha_de_nacimiento DATE,
    estado INTEGER,
    imagen VARCHAR(300),
    FOREIGN KEY (grupo) REFERENCES GrupoParroquiales(Documento)
);