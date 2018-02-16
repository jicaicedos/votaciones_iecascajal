/*
	Modelo para la entidad Estudiante
*/
var moongose = require('moongose')
var Schema = moongose.Schema;

moongose.connect('mongodb://localhost/estudiantes')

var estudiante_schema = new Schema {
	est_ID: Number,
	est_nombre: String,
	est_apellidos: String,
	est_fecha_nacimiento: Date,
	est_foto: String
}


var Estudiante = moongose.models('Estudiante', estudiante_schema)

module.exports.Estudiante = Estudiante;
