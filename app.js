/*
	Paso 7 - Instalar "body-parser"

	7.1 npm install body-parser --save
	Instalar este paquete para poder leer los parámetros enviados por el formulario
	usando el método POST

	7.2 require("body-parser")

	7.3 Montar el middleware  app.use()
	se necesita para peticiones json => app.use(bodyParser.json())
	y para decodificar las url => app.use(bodyParser.urlencoded({extended: true}))
		- extended: true = se puede parsear arreglos y muchos más
		- extended: false = es limitado la opción de parseo

	Para poder leer los parametros se va a tener en cuenta el atributo "name" de las etiquetas

*/
const path = require('path')
var express = require('express')
var cons = require('consolidate')
var bodyParser = require('body-parser')

var app = express()

// Establecemos el motor de vistas, es decir tomamos los archivos ".pug" para que express
// con Node.js los conviertan a archivos ".html" 
app.set('view engine', 'pug')

// Se establece el directorio "static" para guardar todos aquellos archivos que van a ser
// embebidos por los archivos ".pug", como por ejemplo imagenes, .css, .js, etc.
app.use("/static", express.static("static"));

// 
app.use(bodyParser.json())

// 
app.use(bodyParser.urlencoded({extended: true}))


// // Parametro 
// // "/" va al raiz
// // req: petición
// // res: respuesta
// Esta es la ruta principal donde colocamos el index.html con index.pug
app.get('/', (req, res) => {
	res.render('index', {nombre: "Javier", apellido: "Caicedo"})
})

// Ruta a el formulario para adicionar nuevo estudiante
app.get('/adicionarEstudiante', (req, res) => {
	res.render('adicionarEstudiante')
})

// Ruta para recibir los datos enviados por el formulario
app.post('/resultado', (req, res) => {
	console.log('Nombre:' + req.body.nombreEstudiante)
	res.send('Recibidos datos de estudiantes...')
})

app.listen(8080)

console.log("\n\n\nBienvenidos al sistema de votaciones")
console.log("\n\nInstitución Educativa Cascajal")
console.log("\n\n¡======== Iniciado servidor ========!")
