/*
	Paso 10 - Virtuals y Validaciones

	Paso 10.1 - Virtuals

	Se usan cuando se deben realizar validaciones a los campos y una buena práctica es 
	hacerlas en los Schema. NO en frontend ni Schemas

	Ejemplo para validad un campo de confirmación de contraseña o correo electrónico
	En vez de crear en el esquema dos variables de correo electrónico, se hace con un
	campo 'virtual'

	10.2 Validaciones

	=> Se deben hacer a nivel de Schema

	=> Los errores se deben manejar al momento de almacenar en la base de datos, mediante el
	callback    <entidad>.save( function(error) {<manejo de errores} )
	Generalmente va en el Main

	Primero validar los datos en Schema

	10.2.1 Uso de 'validate' en el Schema

	var User = new mongoose.Schema ({
		nombre: {type: String, required: true},
		password: {	type: String, 
					required: true,
					minlength: [8, 'La contraseña no debe ser menor a 8 caracteres']
					validate: {
						validator: function(passw) {
							return this.passw.length >= 8   // Siempre debe retornar, para validar si cumple o no
						},
						message: 'La contraseña es muy corta'
					}
				}
	})

	Colocar la validación fuera del esquema
	var validacion_password = {
									validator: function(passw) {
										return this.passw.length >= 8   // Siempre debe retornar, para validar si cumple o no
									},
									message: 'La contraseña es muy corta'
								}


	var User = new mongoose.Schema ({
		nombre: {type: String, required: true},
		password: {	type: String, 
					required: true,
					minlength: [8, 'La contraseña no debe ser menor a 8 caracteres'],
					validate: validacion_password
				}
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
	console.log('Nombre:' + req.body.nombreEstudiante)
	res.send('Recibidos datos de estudiantes...')
})



app.listen(8080)

console.log('\n\n\n¡===========================================')
console.log('\n\nBienvenidos al sistema de votaciones')
console.log('\n\nInstitución Educativa Cascajal')
console.log('\n\nIniciado servidor...')
console.log('\n\n\n¡===========================================')
