var express = require('express')
const path = require('path')
var cons = require('consolidate')
var bodyParser = require('body-parser')
var Estudiante = require('./models/estudiante').Estudiante


/*	================================================================
				Inicio de la aplicación : Main
================================================================  */
// Instancia del servidor
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
// app.get('/', (req, res) => {
// 	res.render('index')
// })

// Ruta a el formulario para adicionar nuevo estudiante
app.get('/adicionarEstudiante', (req, res) => {
	console.log("GET -> adicionarEstudiante")
	res.render('adicionarEstudiante')
})

/* ==================================================================
						ADMINISTRADOR
================================================================== */
app.get("/administrador", (req, res) => {
	console.log("GET -> administrador")
	res.render("administrador")
})

// ===========================================================================
// Pagina inicial: index
// 
app.post("/", (req, res) => {
	console.log("POST /")
	if( req.body.idUsuario == "Administrador" ) {
		res.render("administrador")
	} else {
		let mensaje = "El usuario o contraseña no coinciden"
		res.render("index", {mensaje})
	}
})

app.get("/", (req, res) => {
	console.log("GET -> /")
	res.render("index")
})

// ===========================================================================
// Consultar estudiante para votar
app.post('/consultarEstudiantes', (req, res) => {
	console.log("POST -> consultarEstudiantes: Listado de estudiantes")
	// Parametros:
	// @ find( {<condición>} ) = no hay ninguna condición por eso trae todos los registros
	// @ select( campos o atributos ) = elementos a traer de la base de datos
	// @callback = (error, docs) = función para capturar errores o registros
	// Estudiante.
	// find({}).
	// select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	// exec( (error, docs) => {
	// 	// 2 - Obtener un estudiante mediante el código de estudiante: 'est_ID'		
	// 	let estudiantes = docs
	// 	res.render('consultarEstudiantes', {estudiantes} )
	// })
})

// Consultar estudiantes SOLO IE CASCAJAL
app.get('/consultarEstudiantes', (req, res) => {
	console.log("GET -> consultarEstudiantes: Listado de estudiantes")
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

app.get('/estudiantesIECascajal', (req, res) => {
	console.log("GET -> estudiantesIECascajal: Listado de estudiantes")
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
		res.render('estudiantesIECascajal', {estudiantes} )
	})
})

// ============================================================================
// Votar en la I.E. Cascajal
app.get('/votarIECascajal', (req, res) => {
	console.log("GET -> votar IECascajal" + req.body.gradosIECascajal)
	res.render('votarIECascajal')
})

app.post('/votarIECascajal', (req, res) => {

	console.log("REQ->NAME-BUTON: " + req.body.votar)

	console.log("POST -> votar IECascajal" + req.body.gradosIECascajal)
	Estudiante.
	find({"est_grado": req.body.gradosIECascajal}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		// 2 - Obtener un estudiante mediante el código de estudiante: 'est_ID'		
		let estudiantes = docs
		res.render('votarIECascajal', {estudiantes} )
	})
})

// ============================================================================
// Votar en la Sede El Tobo
app.get('/votarSedeElTobo', (req, res) => {
	console.log("GET -> votar votarSedeElTobo" + req.body.gradosSedeElTobo)
	res.render('votarSedeElTobo')
})

app.post('/votarSedeElTobo', (req, res) => {
	console.log("POST -> votar votarSedeElTobo" + req.body.gradosSedeElTobo)
	Estudiante.
	find({"est_grado": req.body.gradosSedeElTobo, "est_nombre_sede": "EL TOBO"}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		// 2 - Obtener un estudiante mediante el código de estudiante: 'est_ID'		
		let estudiantes = docs
		res.render('votarSedeElTobo', {estudiantes} )
	})
})

// ============================================================================
// Votar en la Sede La Piragua
app.get('/votarSedeLaPiragua', (req, res) => {
	console.log("GET -> votar votarSedeLaPiragua" + req.body.gradosSedeElTobo)
	res.render('votarSedeLaPiragua')
})

app.post('/votarSedeLaPiragua', (req, res) => {
	console.log("POST -> votar votarSedeLaPiragua" + req.body.gradosSedeElTobo)
	Estudiante.
	find({"est_grado": req.body.gradosSedeElTobo, "est_nombre_sede": "LA PIRAGUA"}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		// 2 - Obtener un estudiante mediante el código de estudiante: 'est_ID'		
		let estudiantes = docs
		res.render('votarSedeLaPiragua', {estudiantes} )
	})
})

// ============================================================================
// Votar en la Sede Paquies
app.get('/votarSedePaquies', (req, res) => {
	console.log("GET -> votar votarSedePaquies" + req.body.gradosSedeElTobo)
	res.render('votarSedePaquies')
})

app.post('/votarSedePaquies', (req, res) => {
	console.log("POST -> votar votarSedePaquies" + req.body.gradosSedeElTobo)
	Estudiante.
	find({"est_grado": req.body.gradosSedeElTobo, "est_nombre_sede": "PAQUIES"}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		// 2 - Obtener un estudiante mediante el código de estudiante: 'est_ID'		
		let estudiantes = docs
		res.render('votarSedePaquies', {estudiantes} )
	})
})

// ============================================================================
// Votar por Personero
// 
app.post("/personero", (req, res) => {
	console.log("POST -> personero")
	console.log("No. Identificación estudiante: " + req.body.votar)
	let est_ID = req.body.votar
	res.render("personero", {est_ID})
})


// ============================================================================
// Votar por representante de grado 11
// 
// app.get("/representanteGrado11", (req, res) => {
// 	console.log("GET -> representanteGrado11")
// 	console.log("personero: " + req.body.personero)
// 	res.render("representanteGrado11")
// })

app.post("/representanteGrado11", (req, res) => {
	console.log("GET -> representanteGrado11")
	console.log("OK personero: " + req.body.personero)
	let personero = req.body.personero
	// console.log("ID-EST: "+est_ID)
	// res.render("representanteGrado11", {est_ID, personero})
	res.render("representanteGrado11", {personero})
})

// ============================================================================
// Final de votación
// 
app.post("/finalProcesoVotacion", (req, res) => {
	console.log("POST -> finalProcesoVotacion")
	console.log("OK representante11: " + req.body.representante11)
	res.render("finalProcesoVotacion")	
})

// app.get("/finalProcesoVotacion", (req, res) => {
// 	console.log("GET -> finalProcesoVotacion")
// 	console.log("representante11: " + req.body.representante11)
// 	res.render("finalProcesoVotacion")	
// })

app.listen(8080)

