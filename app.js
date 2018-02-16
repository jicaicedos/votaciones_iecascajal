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
	
*/

const path = require('path')
var express = require('express')
var cons = require('consolidate')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var Schema = mongoose.Schema


// Para conexión con el motor de base de datos NoSQL - MongoDB
mongoose.connect('mongodb://localhost/fotos')

var userSchemaJSON = {
	email: 'email',
	pass: 'pass'
}

var user_schema = new Schema(userSchemaJSON)  // = mongoose.Schema

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
