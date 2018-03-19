var mongoose = require("mongoose")
var Schema = mongoose.Schema

mongoose.connect("mongodb://localhost/dbvotacionescascajal")

var votante_schema = new Schema({
    vot_sede: {type: String, required: true, maxlength:[100, "El nombre de la sede no puede tener más de 20 caracteres"]},
    vot_grado: {type: String, required: true, maxlength:[20, "El valor para grado no puede tener más de 10 caracteres"]},
    votante_doc_identificacion: {type: Number, required: true},
    vot_fecha: {type: Date, required: true}	
});

var Votante = mongoose.model("Votante", votante_schema)

module.exports.Votante = Votante