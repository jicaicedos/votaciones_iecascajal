var mongoose = require("mongoose")
var Schema = mongoose.Schema


mongoose.connect("mongodb://localhost/dbvotacionescascajal")

var usuario_schema = new Schema({
    usu_ID : {type: String, required: true},
    usu_contraseña: {type: String, required: true},
    usu_nombre: {type: String, required: true},
    usu_sede: {type: String, required: true},
    usu_grado: {type: String, required: true},
    usu_rol: {type: String, required: true}
})

var Usuario = mongoose.model("Usuario", usuario_schema)

module.exports.Usuario = Usuario