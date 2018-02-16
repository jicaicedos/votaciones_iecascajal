/*
	Paso 8 - Instalar motor base de datos MongoDB 

	Almacena datos en formato JSON, basado en documentos

	8.1 Instalar MongoDB 

	Para windows - descargar el instalador y seguir las instrucciones (ejecutar instalador)

	Se hará uso de "mongoose" es un ORM (Object Relational Mapping) Mapea de Modelo relacional a objetos
	mediante una API "ofusca" los datos

	8.2 Instalar mongoose => npm mongoose --save
	
	para llamar a este paquete que facilitará la conexión con los datos de mongo ya que serán más legibles
	var mongoose = require('mongoose')

	8.3 Como ejemplo nos vamos a conectar a 'localhost'

	mongoose.connect('mongodb://localhost/page')

	8.4 Tipos de datos y uso de esquemas

	Se trabaja con documentos, es decir, objetos JSON
	Se debe trabajar con 'Schema' de mogoose => Schema = mongoose.Schema, sirve para crear un modelo
	para mapear el objeto o registro
	
	8.5 Conectar a una base de datos

	mongoose.connect('mongodb://localhost/<directorio>')

	Paso 9 - Schemas y Modelos

	Los esquemas son las estructura de nuestros datos en MogoDB

	9.1 Tipos de datos en MongoDB

	Los valores pueden ser de seis tipos:
	- String o cadena.
	- Number o número.
	- Boolean o booleano (true o false)
	- null.
	- Array.
	- Objeto o documento, es decir un objeto JSON puede contener otro documento JSON, 
	   sin límite de recursividad.
	- Buffer
	- Mixed

	Ver: https://docs.mongodb.com/manual/reference/bson-types/

	Ej: Esquema de usuario

	var user_schema = User {
		email: String,
		password: password
	}

	9.2 Modelos: estos deben estar en la carpeta 'models'

	Son instancias para hacer llamados a la base de datos

	// En la bd debe exisitir la entidad en plural
	var entidad = mongoose.model('<entidad_en_singular>', <schema>) 

	Ej:  var User = mongoose.model('User',user_schema)

	// Se debe exportar el modelo
	module.exports.User = User

	Finalmente en el 'Main' importarmos o solicitamos el modelo
	var User = require('./models/user').User

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

console.log('\n\n\nBienvenidos al sistema de votaciones')
console.log('\n\nInstitución Educativa Cascajal')
console.log('\n\n¡======== Iniciado servidor ========!')
