const path = require('path')
var express = require('express')
var cons = require('consolidate')

var app = express()

app.set('view engine', 'pug')

// app.set("views", path.join(__dirname, "views"))

app.use( express.static( "static" ) );

// app.use("/static", express.static(path.join(__dirname, "public")))
// // Parametro 
// // "/" va al raiz
// // req: petición
// // res: respuesta
app.get('/', (req, res) => {
	res.render('index', {nombre: "Javier", apellido: "Caicedo"})
})

app.listen(8080)