/*
	Modelo para la entidad Estudiante
*/
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/dbvotacionescascajal')

var estudiante_schema = new Schema ({
	est_anio: {type: Number},
	est_secretaria: {type: String, maxlength: [30, "el nombre de la secretaría no puede exceder los 30 caracteres"]},
	est_dane_ie: {type: Number, required: true},
	est_nombre_ie: {type: String, required: true, maxlength:50},	
	est_dane_sede: {type: Number, required: true},
	est_nombre_sede: {type: String, required: true, maxlength:50},
	est_jornada: {type: String, required: true},
	est_calendario: {type: String, required: true, maxlength: 2},
	est_grado: {type: String, required: true, maxlength: 12},
	est_sector: {type: String, required: true, maxlength: 10},
	est_grupo: {type: Number, required: true, maxlength: 4},
	est_modelo_educativo: {type: String, required: true, maxlength: 20},
	est_tipo_identificacion: {type: String, required: true, maxlength:20},
	est_doc: {type: Number, required: true, maxlength: 15},
	est_primer_apellido: {type: String, required: true, maxlength: 15},
	est_segundo_apellido: {type: String, required: true, maxlength: 20},
	est_primer_nombre: {type: String, required: true, maxlength: 20},
	est_segundo_nombre: {type: String, required: true, maxlength: 20},
	est_estado: {type: String, required: true, maxlength: 15},
	est_matricula_contratada: {type: String, required: true, maxlength:2},
	est_fuente_recursos: {type: String, required: true, maxlength:5}
});

var Estudiante = mongoose.model('Estudiante', estudiante_schema)

module.exports.Estudiante = Estudiante;
