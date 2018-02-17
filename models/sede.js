/*
	Modelo para la entidad Sede
*/
var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/sede')

var sede_schema = new Schema ({
	sede_ID: {type: Number, required: true},
	sede_nombre: {type: String, maxlength: [100, 'El nombre de la sede no puede exceder los 100 caracteres'], required: true},
	sede_direccion: {type: String, maxlength: [100, 'La dirección no puede exceder los 100 caracteres']},
	sede_telefono: {type: Number, required: true, maxlength: [12, 'El número de telefono no puede ser mayor a 12 digitos']}
});

var Sede = mongoose.model('Sede', sede_schema)

module.exports.Sede = Sede
