/*
	Paso 11 - Mongoose save

	Guardar el objeto en la base de datos, se necesita un modelo Ej. Estudiante que ya lo tenemos

	var estudiante = new Estudiante({....})		 // Parametro es el objeto JSON

	estudiante.save(callback)

	Ej. 

	estudiante.save( function(error, estudiante, numero) {
		// No crea objetos sino que actualiza, sobreescribe
		error: recibe el error generado al guardar
		estudiante: objeto ya guardado
		numero: cantidad de filas afectadas
	})

	Actualmente se usa 'promises' o promesas, significa que en vez de retornar un callback, recibe una promesa
	y se debe ejecutar el metodo '.then( function(usr) {
		.....
		// 'guardado correctamente'		
		obj.send('Se guardo correctamente')
	}, function(error) {
		if(error) {
			.......
			// 'no se logró guardar'
			Ej: console.log(String(err))
			obj.send('No se pudo guardar en la base de datos')
		}
	})'

	// Ejemplo:

	var estudiante = new Estudiante({
		est_ID: req.body.codigoEstudiante,
		est_nombre: req.body.nombreEstudiante,
		est_apellidos: req.body.apellidoEstudiante,
		est_fecha_nacimiento: req.body.fechaNacimientoEstudiante,
		est_foto: req.body.fotoEstudiante
	})

	estudiante.save().then( (est) => {
		res.send("Guadado exitosamente")
	}, (error) => {
		res.send("Fallo al guardar en la base de datos")
	})		

*/
const path = require('path')
var express = require('express')
var cons = require('consolidate')
var bodyParser = require('body-parser')
var Estudiante = require('./models/estudiante').Estudiante


/*	================================================================
	
				Inicio de la aplicación : Main

	================================================================
*/

var app = express()

// Establecemos el motor de vistas, es decir tomamos los archivos ".pug" para que express
// con Node.js los conviertan a archivos ".html" 
app.set('view engine', 'pug')

// Se establece el directorio "static" para guardar todos aquellos archivos que van a ser
// embebidos por los archivos ".pug", como por ejemplo imagenes, .css, .js, etc.
app.use("/static", express.static("static"));

// Se establece el middleware para reconocer los archivos JSON
app.use(bodyParser.json())

// Con este middleware se puede leer correctamente los parametros que vienen en la URL
// mediante los llamados o enviados con el metodo POST, se debe dejar el valor en 'true'
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
	var estudiante = new Estudiante({
		est_ID: req.body.codigoEstudiante,
		est_nombre: req.body.nombreEstudiante,
		est_apellidos: req.body.apellidoEstudiante,
		est_fecha_nacimiento: req.body.fechaNacimientoEstudiante,
		est_foto: req.body.fotoEstudiante
	})

	estudiante.save().then( (est) => {
		res.send("Guadado exitosamente")
	}, (error) => {
		res.send("Fallo al guardar en la base de datos")
	})
})

app.listen(8080)
