/*
	Modelo para la entidad Personero
*/
var mongoose = require("mongoose")
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/dbvotacionescascajal")

var candidato_schema = new Schema ({
	est_anio: {type: Number},
	est_secretaria: {type: String, maxlength: [100, "el nombre de la secretaría no puede exceder los 30 caracteres"]},
	est_dane_ie: {type: Number, required: true},
	est_nombre_ie: {type: String, required: true, maxlength:100},	
	est_dane_sede: {type: Number, required: true},
	est_nombre_sede: {type: String, required: true, maxlength:100},
	est_jornada: {type: String, required: true},
	est_calendario: {type: String, maxlength: 2},
	est_grado: {type: String, required: true, maxlength: 20},
	est_sector: {type: String, maxlength: 50},
	est_grupo: {type: Number, maxlength: 10},
	est_modelo_educativo: {type: String, maxlength: 100},
	est_tipo_identificacion: {type: String, required: true, maxlength: 100},
	est_doc: {type: Number, required: true, maxlength: 20},
	est_primer_apellido: {type: String, required: true, maxlength: 30},
	est_segundo_apellido: {type: String, maxlength: 30},
	est_primer_nombre: {type: String, required: true, maxlength: 30},
	est_segundo_nombre: {type: String, maxlength: 30},
	est_estado: {type: String, maxlength: 30},
	est_matricula_contratada: {type: String, maxlength:20},
	est_fuente_recursos: {type: String, maxlength:20},
	est_tipo_candidato: {type: String, required:true, maxlength: 30},
	est_num_tarjeton: {type: Number, required:true},
	est_foto: {type: String, required:true, maxlength:400}
});

var Candidato = mongoose.model("Candidato", candidato_schema)

module.exports.Candidato = Candidato;
