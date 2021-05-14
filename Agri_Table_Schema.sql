-- Drop table if exists
DROP TABLE Agri2017;


CREATE TABLE Agri2017 (
	anio INT,
	idest VARCHAR,
	PRIMARY KEY (idest),
	estado VARCHAR,
	idmuni VARCHAR,
	municipio VARCHAR,
	cicloproductivo VARCHAR,
	modalidad VARCHAR,
	unidad VARCHAR,
	cultivo VARCHAR,
	sembrada INT,
	cosechada INT,
	siniestrada INT,
	volumenproduccion FLOAT,
	rendimiento FLOAT,
	precio FLOAT,
	valorproduccion FLOAT,
	sembradavscosecha FLOAT,
	valorxhectarea FLOAT
);