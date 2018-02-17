/*
	Modelo para la entidad Docente
*/
var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/docente')

var generos = ['Masculino', 'Femenino']

var docente_schema = new Schema({
 	doc_ID: {type: Number, required: true},
	doc_nombre: {type: String, maxlength: [100, 'El nombre del docente no debe exceder 100 letras'], required: true},
	doc_direccion: {type: String, required: true, maxlength: [100, 'La dirección no debe exceder los 100 caracteres']},
	doc_telefono: {type: Number, required: true},
	est_genero: {type: String, enum: {values: generos, message: 'Opción no válida'}}
});

var Docente = mongoose.model('Docente', docente_schema)

module.exports.Docente = Docente
