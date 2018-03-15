var express = require('express')
const path = require('path')
var cons = require('consolidate')
var bodyParser = require('body-parser')
var Estudiante = require('./models/estudiante').Estudiante
var Votaciones = require("./models/votaciones").Votaciones
var Votante = require("./models/votante").Votante


/*	================================================================
				Inicio de la aplicación : Main
================================================================  */
// Instancia del servidor
var app = express()

// Variables globales del sistema
var nom_sede 				// Guarda el nombre de la sede
var num_grado_estudiante	// Guarda el grado del estudiante
var num_id_estudiante		// Guarda el número de identificación del estudiante
var num_personero			// Guarda el número del personero votado
var num_representante		// Guarda el número del representante votado
var ids_estudiantes_ya_votaron = []
var registros_a_bloquear = []


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


// Ruta a el formulario para adicionar nuevo estudiante
app.get('/adicionarEstudiante', (req, res) => {
	console.log("GET -> adicionarEstudiante")
	res.render('adicionarEstudiante')
})

/* ==================================================================
						ADMINISTRADOR
================================================================== */
// 
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
// 
app.post('/consultarEstudiantes', (req, res) => {
	console.log("POST -> consultarEstudiantes: Listado de estudiantes")
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
		let estudiantes = docs
		res.render('estudiantesIECascajal', {estudiantes} )
	})
})

// ============================================================================
// Votar en la I.E. Cascajal
app.get('/votaciones', (req, res) => {
	console.log("GET -> votar IECascajal" + req.body.gradosIECascajal)
	res.render('votaciones')
})

app.post('/votaciones', (req, res) => {
	let ids_estudiantes_ya_votaron = []
	let estudiantes = []
	let registros_a_bloquear = []

	nom_sede = "CASCAJAL"
	num_grado_estudiante = req.body.gradosIECascajal

	Votante.
	find({"vot_sede": nom_sede, "vot_grado":num_grado_estudiante}).
	select( {_id:0, votante_doc_identificacion:1} ).
	exec( (error, docs) => {
		ids_estudiantes_ya_votaron = obtener_ids_estudiantes_ya_votaron(docs)
	})


	if( req.body.gradosIECascajal=="SEXTO A" ) {
		Estudiante.
		find({"est_grupo": 601, "est_nombre_sede": "CASCAJAL"}).
		select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
		exec( (error, docs) => {
			let estudiantes = docs
			registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
			res.render('votaciones', {estudiantes, registros_a_bloquear} )
		})			

	} else if( req.body.gradosIECascajal=="SEXTO B" ) {
		Estudiante.
		find({"est_grupo": 602, "est_nombre_sede": "CASCAJAL"}).
		select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
		exec( (error, docs) => {
			let estudiantes = docs
			registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
			res.render('votaciones', {estudiantes, registros_a_bloquear} )
		})	
	} else if( req.body.gradosIECascajal=="OCTAVO A" ) {
		Estudiante.
		find({"est_grupo": 801, "est_nombre_sede": "CASCAJAL"}).
		select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
		exec( (error, docs) => {
			let estudiantes = docs
			registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
			res.render('votaciones', {estudiantes, registros_a_bloquear} )
		})			

	} else if( req.body.gradosIECascajal=="OCTAVO B" ) {
		Estudiante.
		find({"est_grupo": 802, "est_nombre_sede": "CASCAJAL"}).
		select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
		exec( (error, docs) => {
			let estudiantes = docs
			registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
			res.render('votaciones', {estudiantes, registros_a_bloquear} )
		})	
	} else {
		Estudiante.
		find({"est_grado": req.body.gradosIECascajal, "est_nombre_sede": "CASCAJAL"}).
		select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
		exec( (error, docs) => {
			estudiantes = docs
			registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
			res.render('votaciones', {estudiantes, registros_a_bloquear} )
		})		
	}

})

// ============================================================================
// Votar en la Sede 2) El Tobo
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
		let estudiantes = docs
		registros_a_bloquear = bloquearRegistros(estudiantes, votarSede(nom_sede, num_grado_estudiante))
		res.render('votarSedeElTobo', {estudiantes, registros_a_bloquear} )
	})
})

// ============================================================================
// Votar en la Sede La Piragua
app.get('/votarSedeLaPiragua', (req, res) => {
	console.log("GET -> votar votarSedeLaPiragua" + req.body.gradosSedeLaPiragua)
	res.render('votarSedeLaPiragua')
})

app.post('/votarSedeLaPiragua', (req, res) => {
	console.log("POST -> votar votarSedeLaPiragua" + req.body.gradosSedeLaPiragua)
	Estudiante.
	find({"est_grado": req.body.gradosSedeLaPiragua, "est_nombre_sede": "LA PIRAGUA"}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		let estudiantes = docs
		registros_a_bloquear = bloquearRegistros(estudiantes, votarSede(nom_sede, num_grado_estudiante))
		res.render('votarSedeLaPiragua', {estudiantes, registros_a_bloquear} )
	})
})

// ============================================================================
// Votar en la Sede Paquies
app.get('/votarSedePaquies', (req, res) => {
	console.log("GET -> votar votarSedePaquies" + req.body.gradosSedePaquies)
	res.render('votarSedePaquies')
})

app.post('/votarSedePaquies', (req, res) => {
	console.log("POST -> votar votarSedePaquies" + req.body.gradosSedePaquies)
	Estudiante.
	find({"est_grado": req.body.gradosSedePaquies, "est_nombre_sede": "PAQUIES"}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		let estudiantes = docs
		registros_a_bloquear = bloquearRegistros(estudiantes, votarSede(nom_sede, num_grado_estudiante))
		res.render('votarSedePaquies', {estudiantes, registros_a_bloquear} )
	})
})
// ============================================================================
// Votar en la Sede La Esperanza
app.get('/votarSedeLaEsperanza', (req, res) => {
	console.log("GET -> votar votarSedeLaEsperanza" + req.body.gradosSedeLaEsperanza)
	res.render('votarSedeLaEsperanza')
})

app.post('/votarSedeLaEsperanza', (req, res) => {
	console.log("POST -> votar votarSedeLaEsperanza" + req.body.gradosSedeLaEsperanza)
	Estudiante.
	find({"est_grado": req.body.gradosSedeLaEsperanza, "est_nombre_sede": "LA ESPERANZA"}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		let estudiantes = docs
		registros_a_bloquear = bloquearRegistros(estudiantes, votarSede(nom_sede, num_grado_estudiante))
		res.render('votarSedeLaEsperanza', {estudiantes, registros_a_bloquear} )
	})
})

// ============================================================================
// Votar en la Sede La Florida
app.get('/votarSedeLaFlorida', (req, res) => {
	console.log("GET -> votar votarSedeLaFlorida" + req.body.gradosSedeLaFlorida)
	res.render('votarSedeLaFlorida')
})

app.post('/votarSedeLaFlorida', (req, res) => {
	console.log("POST -> votar votarSedeLaFlorida" + req.body.gradosSedeLaFlorida)
	Estudiante.
	find({"est_grado": req.body.gradosSedeLaFlorida, "est_nombre_sede": "LA FLORIDA"}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		let estudiantes = docs
		registros_a_bloquear = bloquearRegistros(estudiantes, votarSede(nom_sede, num_grado_estudiante))
		res.render('votarSedeLaFlorida', {estudiantes, registros_a_bloquear} )
	})
})

// ============================================================================
// Votar en la Sede Mateo Rico
app.get('/votarSedeMateoRico', (req, res) => {
	console.log("GET -> votar votarSedeMateoRico" + req.body.gradosSedeMateoRico)
	res.render('votarSedeMateoRico')
})

app.post('/votarSedeMateoRico', (req, res) => {
	console.log("POST -> votar votarSedeMateoRico" + req.body.gradosSedeMateoRico)

	nom_sede = "MATEO RICO"
	num_grado_estudiante = req.body.gradosSedeMateoRico

	Estudiante.
	find({"est_grado": req.body.gradosSedeMateoRico, "est_nombre_sede": "MATEO RICO"}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		let estudiantes = docs
		registros_a_bloquear = bloquearRegistros(estudiantes, votarSede(nom_sede, num_grado_estudiante))
		res.render('votarSedeMateoRico', {estudiantes, registros_a_bloquear} )
	})
})

// ============================================================================
// Votar por Personero
// 
app.post("/personero", (req, res) => {
	console.log("POST -> personero")
	console.log("No. Identificación estudiante: " + req.body.documentoIdentidadEstudiante)
	let est_ID = req.body.documentoIdentidadEstudiante
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("personero", {est_ID, nom_sede})
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
	console.log("personero: " + req.body.personero)
	let personero = req.body.personero
	num_personero = req.body.personero
	res.render("representanteGrado11", {personero})
})

// ============================================================================
// Final de votación
// 
app.post("/finalProcesoVotacion", (req, res) => {
	console.log("POST -> finalProcesoVotacion")

	if( nom_sede=="CASCAJAL") { // y grado == "TALES"
		num_representante = req.body.representante11
	} else {
		num_representante = 3
	}

	var votaciones = new Votaciones({
	    vot_sede: nom_sede,
	    vot_grado: num_grado_estudiante,
	    vot_personero: num_personero,
	    vot_representante: num_representante,
	    vot_fecha: new Date()
	});

	var votante = new Votante({
	    vot_sede: nom_sede,
	    vot_grado: num_grado_estudiante,
	    votante_doc_identificacion: num_id_estudiante,
	    vot_fecha: new Date()
	});

	console.log(votaciones)

	// Guardar en la base de datos de VOTACIONES
	votaciones.save().then( (est) => {	
		console.log("Votación guardada correctamente!") 
	}, (error) => { console.log("Error al escibir en la base de datos. Collection: votaciones") })

	// Guardar en la base de datos de VOTANTES
	votante.save().then( (est) => {
		res.render("finalProcesoVotacion")
	}, (error) => { res.send("Error al escibir en la base de datos. Collection: votantes") })

})

// ============================================================================
// 		
// 
function votarSede(nom_sede, num_grado_estudiante) {
	Votante.
	find({"vot_sede": nom_sede, "vot_grado":num_grado_estudiante}).
	select( {_id:0, votante_doc_identificacion:1} ).
	exec( (error, docs) => {
		ids_estudiantes_ya_votaron = obtener_ids_estudiantes_ya_votaron(docs)
	})

	return ids_estudiantes_ya_votaron
}

function obtener_ids_estudiantes_ya_votaron(lista_ya_votaron) {
	// Arreglo de numeros de identificación de estudiantes que ya votarion
	var numeros_id_estudiantes = []

	for( let i=0; i<lista_ya_votaron.length; i++ ) {
		numeros_id_estudiantes[i] = lista_ya_votaron[i].votante_doc_identificacion
	}

	return numeros_id_estudiantes
}

// Función para bloquear registros de aquellos estudiantes que ya votaron
function bloquearRegistros(estudiantes, estudiantes_ya_votaron) {
	let regs_a_bloquear = []
	let bloquear = 1
	let no_bloquear = 0
	for(let i=0; i<estudiantes.length; i++) {
		regs_a_bloquear[i] = no_bloquear
		for(let j=0; j<estudiantes_ya_votaron.length; j++) {
			if( estudiantes[i].est_doc==estudiantes_ya_votaron[j] ) {
				regs_a_bloquear[i] = bloquear
			}
		}		
	}
	return regs_a_bloquear
}

app.listen(8080)

