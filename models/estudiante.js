/*
	Modelo para la entidad Estudiante
*/
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/estudiante')

var generos = ['Masculino', 'Femenino']

var estudiante_schema = new Schema ({
	est_ID: {type: Number, required: true},
	est_nombre: {type:String, required: true, maxlength: [50, "El nombre no puede exceder los 50 caracteres"]},
	est_apellidos: {type:String, required: true, maxlength: [50, "El apellido no debe exceder los 50 caracteres"]},
	est_fecha_nacimiento: {type: Date, required: true},
	est_foto: {type: String, required: true},
	est_genero: {type: String, enum: {values: generos, message: 'Opción no válida para género'}}
});

var Estudiante = mongoose.model('Estudiante', estudiante_schema)

module.exports.Estudiante = Estudiante;
