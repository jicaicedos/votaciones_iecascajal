var mongoose = require("mongoose")
var Schema = mongoose.Schema

mongoose.connect("mongodb://localhost/dbvotacionescascajal")

var votaciones_schema = new Schema({
    vot_sede: {type: String, required: true, maxlength:[20, "El nombre de la sede no puede tener más de 20 caracteres"]},
    vot_grado: {type: String, required: true, maxlength:[10, "El valor para grado no puede tener más de 10 caracteres"]},
    vot_personero: {type: Number, required: true, maxlength: 1},
    vot_representante: {type: Number, required: true, maxlength: 1},
    vot_fecha: {type: Date, required: true}
});

var Votaciones = mongoose.model("Votaciones", votaciones_schema)

module.exports.Votaciones = Votaciones
