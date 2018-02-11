const path = require('path')
var express = require('express')

var app = express()

app.set('view engine', 'pug')
// Parametro 
// "/" va al raiz
// req: petición
// res: respuesta
app.get('/', function(req, res) {
	res.render('index', {nombre: "Javier", apellido: "Caicedo"})
})

app.listen(8080)