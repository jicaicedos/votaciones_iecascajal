/*
	Paso 11 - save
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

	Paso 12 - find

	app.get('/consultarEstudiantes', (req, res) => {
		// 1 - Obtener el listado de todos los estudiantes
		Estudiante.find( {}, 'est_nombre est_apellidos est_fecha_nacimiento est_foto', (error, docs) => {

		// 2 - Obtener un estudiante mediante el código de estudiante: 'est_ID'
		// Estudiante.find( {est_ID:'10001'}, 'est_nombre est_apellidos est_fecha_nacimiento est_foto', (error, docs) => {

			// res.render('consultarEstudiantes')
			res.send(docs)		
		}, (error) => {
			console.log("No se pudo cargar los datos de los estudiantes")
		})
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
	res.render('index')
})

// Ruta a el formulario para adicionar nuevo estudiante
app.get('/adicionarEstudiante', (req, res) => {
	res.render('adicionarEstudiante')
})

// Ruta para recibir los datos enviados por el formulario
// ADICIONAR....
app.post('/resultado', (req, res) => {
	var estudiante = new Estudiante({
		est_ID: req.body.codigoEstudiante,
		est_nombre: req.body.nombreEstudiante,
		est_apellidos: req.body.apellidoEstudiante,
		est_fecha_nacimiento: req.body.fechaNacimientoEstudiante,
		est_foto: '/static/imagenes/fotos_alumnos/'+req.body.fotoEstudiante
	})

	estudiante.save().then( (est) => {
		res.send("Guadado exitosamente")
	}, (error) => {
		res.send("Fallo al guardar en la base de datos")
	})
})

app.get('/consultarEstudiantes', (req, res) => {
	console.log("GET -> consultarEstudiantes: Listado de estudiantes")
	// 1 - Obtener el listado de todos los estudiantes
	// Parametros:
	// @ find( {<condición>} ) = no hay ninguna condición por eso trae todos los registros
	// @ select( campos o atributos ) = elementos a traer de la base de datos
	// @callback = (error, docs) = función para capturar errores o registros
	Estudiante.
	find({}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		// 2 - Obtener un estudiante mediante el código de estudiante: 'est_ID'		
		let estudiantes = docs
		res.render('consultarEstudiantes', {estudiantes} )
	})
})

app.listen(8080)
