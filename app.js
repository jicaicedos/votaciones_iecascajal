var express = require("express")
const path = require("path")
var cons = require("consolidate")
var bodyParser = require("body-parser")
var Estudiante = require("./models/estudiante").Estudiante
var Votaciones = require("./models/votaciones").Votaciones
var Votante = require("./models/votante").Votante
var Usuario = require("./models/usuario").Usuario
var Candidato  = require("./models/candidato").Candidato

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
var estudiantes = []
var registros_a_bloquear = []

var estudiantePersonero 	// Variable para almacenar temporalmente el estudiante como personero => adicionarPersonero



// Establecemos el motor de vistas, es decir tomamos los archivos ".pug" para que express
// con Node.js los conviertan a archivos ".html" 
app.set("view engine", "pug")

// Se establece el directorio "static" para guardar todos aquellos archivos que van a ser
// embebidos por los archivos ".pug", como por ejemplo imagenes, .css, .js, etc.
app.use("/static", express.static("static"));

// Se establece el middleware para reconocer los archivos JSON
app.use(bodyParser.json())

// Con este middleware se puede leer correctamente los parametros que vienen en la URL
// mediante los llamados o enviados con el metodo POST, se debe dejar el valor en 'true'
app.use(bodyParser.urlencoded({extended: true}))


// Ruta a el formulario para adicionar nuevo estudiante
app.get("/adicionarEstudiante", (req, res) => {
	console.log("GET -> adicionarEstudiante")
	res.render("adicionarEstudiante")
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

	Usuario.
	find({"usu_ID": req.body.idUsuario, "usu_contraseña": req.body.claveUsuario}).
	select( {usu_nombre:1, usu_sede:1, usu_grado:1, usu_rol:1}).
	exec( (error, docs) => {
		let mensaje
		if( docs.length==0 ) {
			mensaje = "Usuario o contraseña no coinciden"
			res.render("index", {mensaje})
		} else {
			if( docs[0].usu_rol=="ADMINISTRADOR" ) {
				res.render("administrador")
			} else {				
				if( docs[0].usu_rol == "JURADO" ) {
					if( docs[0].usu_sede == "EL TOBO" ) {
						console.log(docs[0].usu_sede)
						res.render("sedeElTobo")
					} else if( docs[0].usu_sede == "LA PIRAGUA" ) {
						res.render("sedeLaPiragua")
					} else if( docs[0].usu_sede == "MATEO RICO" ) {
						res.render("sedeMateoRico")
					} else if( docs[0].usu_sede == "PAQUIES" ) {
						res.render("sedePaquies")
					} else if( docs[0].usu_sede == "LA FLORIDA" ) {
						res.render("sedeLaFlorida")
					} else if( docs[0].usu_sede == "LA ESPERANZA" ) {
						res.render("sedeLaEsperanza")
					} else if( docs[0].usu_sede == "CASCAJAL" ) {
						res.render("sedeIECascajal")
					} 
				}
			}
		}
	}) 
})

app.get("/", (req, res) => {
	console.log("GET -> /")
	res.render("index")
})

app.get("/reporteVotacionTobo", (req, res) => {
	// Votaciones.
	res.render("reporteVotacionTobo")
})
// ===========================================================================
// Gestión de candidatos


// Adicionar candidato a personero
app.get("/adicionarCandidato", (req, res) => {
	res.render("adicionarCandidato")
})

app.get("/consultarEstudianteParaCandidato", (req, res) => {
	res.render("consultarEstudianteParaCandidato")
})

app.post("/consultarEstudianteParaCandidato", (req, res) => {
	let estudiante
	let idEstudiante = req.body.idEstudiante

	Estudiante.
	find({"est_doc": idEstudiante}).
	select({
		_id:0, 
		est_anio:1,
		est_secretaria:1,
		est_dane_ie:1,
		est_nombre_ie:1,
	    est_dane_sede:1,
	    est_nombre_sede:1,
	    est_jornada:1,
	    est_calendario:1,
		est_grado:1, 
		est_sector:1,
		est_grupo:1,
		est_modelo_educativo:1,
		est_tipo_identificacion:1, 
		est_doc:1, 
		est_primer_apellido:1, 
		est_segundo_apellido:1, 
		est_primer_nombre:1, 
		est_segundo_nombre:1, 
		est_estado:1,
		est_matricula_contratada:1, 
		est_fuente_recursos:1
	}).
	exec( (error, docs) => {
		estudiantePersonero = docs[0]
		if( !estudiantePersonero ) {		
			let mensaje = "El estudiante no se encuentra registrado."
			res.render("adicionarCandidato", {mensaje})
		} else {
			res.render("consultarEstudianteParaCandidato", {estudiantePersonero} )
		}
	})
})

app.post("/finalAdicionarCandidato", (req, res) => {
	var est_candidato = new Candidato({
		est_anio: estudiantePersonero.est_anio,
		est_secretaria: estudiantePersonero.est_secretaria,
		est_dane_ie: estudiantePersonero.est_dane_ie,
		est_nombre_ie: estudiantePersonero.est_nombre_ie,
		est_dane_sede: estudiantePersonero.est_dane_sede,
		est_nombre_sede: estudiantePersonero.est_nombre_sede,
		est_jornada: estudiantePersonero.est_jornada,
		est_calendario: estudiantePersonero.est_calendario,
		est_grado: estudiantePersonero.est_grado,
		est_sector: estudiantePersonero.est_sector,
		est_grupo: estudiantePersonero.est_grupo,
		est_modelo_educativo: estudiantePersonero.est_modelo_educativo,
		est_tipo_identificacion: estudiantePersonero.est_tipo_identificacion,
		est_doc: estudiantePersonero.est_doc,
		est_primer_apellido: estudiantePersonero.est_primer_apellido,
		est_segundo_apellido: estudiantePersonero.est_segundo_apellido,
		est_primer_nombre: estudiantePersonero.est_primer_nombre,
		est_segundo_nombre: estudiantePersonero.est_segundo_nombre,
		est_estado: estudiantePersonero.est_estado,
		est_matricula_contratada: estudiantePersonero.est_matricula_contratada,
		est_fuente_recursos: estudiantePersonero.est_fuente_recursos,
		est_tipo_candidato: req.body.tipo_candidato,
		est_num_tarjeton: req.body.numeroTarjeton,
		est_foto: req.body.fotoEstudiante
	})

	est_candidato.save().then( (est) => {
		res.render("finalAdicionarCandidato")
	}, (error) => {
		let mensaje = "No se guardó el registro, por favor intentarlo de nuevo"
		res.render("finalAdicionarCandidato", {mensaje})
	})

})

// ===========================================================================
// Consultar estudiante para votar
// 
app.post("/consultarEstudiantes", (req, res) => {
	console.log("POST -> consultarEstudiantes: Listado de estudiantes")
})

// Consultar estudiantes SOLO IE CASCAJAL
app.get("/consultarEstudiantes", (req, res) => {
	console.log("GET -> consultarEstudiantes: Listado de estudiantes")
	Estudiante.
	find({}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		estudiantes = docs
		res.render("consultarEstudiantes", {estudiantes} )
	})
})

app.get("/estudiantesIECascajal", (req, res) => {
	console.log("GET -> estudiantesIECascajal: Listado de estudiantes")
	Estudiante.
	find({}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		estudiantes = docs
		res.render("estudiantesIECascajal", {estudiantes} )
	})
})

// ============================================================================
// Consultar candidatos
app.get("/consultarCandidatos", (req, res) => {	
	let mensaje, mensajeOK

	Candidato.
	find().
	exec( (error, docs) => {
		let candidatos = docs
		if( docs.length == 0 ) {
			mensaje = "No hay candidatos inscritos"
			mensajeOK = "VACIO"
			res.render("consultarCandidatos", {mensaje})
		} else {
			mensajeOK = "OK"
			res.render("consultarCandidatos", {candidatos, mensajeOK})
		}		
	}, (error) => {
		mensajeOK = "ERROR"
		mensaje = "No se pudo leer los datos de los candidatos, por favor intentar nuevamente"		
		res.render("consultarCandidatos", {mensaje} )
	})
})




// ============================================================================
// Votar en la I.E. Cascajal
app.get("/sedeIECascajal", (req, res) => {
	res.render("sedeIECascajal")
})

app.get("/votarIECascajal", (req, res) => {
	console.log("GET -> votar IECascajal" + req.body.gradosIECascajal)
	res.render("votarIECascajal")
})

app.post("/votarIECascajal", (req, res) => {

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
			estudiantes = docs
			registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
			let sedes = "Listado de estudiantes sede I. E. Cascajal"
			let volver_a = "/sedeIECascajal"
			res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
		})			

	} else if( req.body.gradosIECascajal=="SEXTO B" ) {
		Estudiante.
		find({"est_grupo": 602, "est_nombre_sede": "CASCAJAL"}).
		select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
		exec( (error, docs) => {
			estudiantes = docs
			registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
			let sedes = "Listado de estudiantes sede I. E. Cascajal"
			let volver_a = "/sedeIECascajal"
			res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
		})	
	} else if( req.body.gradosIECascajal=="OCTAVO A" ) {
		Estudiante.
		find({"est_grupo": 801, "est_nombre_sede": "CASCAJAL"}).
		select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
		exec( (error, docs) => {
			estudiantes = docs
			registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
			let sedes = "Listado de estudiantes sede I. E. Cascajal"
			let volver_a = "/sedeIECascajal"
			res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
		})			

	} else if( req.body.gradosIECascajal=="OCTAVO B" ) {
		Estudiante.
		find({"est_grupo": 802, "est_nombre_sede": "CASCAJAL"}).
		select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
		exec( (error, docs) => {
			estudiantes = docs
			registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
			let sedes = "Listado de estudiantes sede I. E. Cascajal"
			let volver_a = "/sedeIECascajal"
			res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
		})	
	} else {
		Estudiante.
		find({"est_grado": req.body.gradosIECascajal, "est_nombre_sede": "CASCAJAL"}).
		select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
		exec( (error, docs) => {
			estudiantes = docs
			registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
			let sedes = "Listado de estudiantes sede I. E. Cascajal"
			let volver_a = "/sedeIECascajal"
			res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
		})		
	}

})

// ============================================================================
// Votar en la Sede 2) El Tobo
app.get("/sedeElTobo", (req, res) => {
	res.render("sedeElTobo")
})

app.get("/votarSedeElTobo", (req, res) => {
	console.log("GET -> votar votarSedeElTobo" + req.body.gradosSedeElTobo)
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("listarEstudiantesVotacion")
})

app.post("/votarSedeElTobo", (req, res) => {
	console.log("POST -> votar votarSedeElTobo" + req.body.gradosSedeElTobo)

	nom_sede = "EL TOBO"
	num_grado_estudiante = req.body.gradosSedeElTobo

	Votante.
	find( {"vot_sede": nom_sede, "vot_grado":num_grado_estudiante} ).
	select( {_id:0, votante_doc_identificacion:1} ).
	exec( (error, docs) => {
		ids_estudiantes_ya_votaron = obtener_ids_estudiantes_ya_votaron(docs)
	})

	Estudiante.
	find({"est_grado": num_grado_estudiante, "est_nombre_sede": nom_sede}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		estudiantes = docs
		registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
		let sedes = "Listado de estudiantes sede El Tobo"
		let volver_a = "/sedeElTobo"
		res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
	})
})
// ============================================================================
// Votar en la Sede 3) La Esperanza
app.get("/sedeLaEsperanza", (req, res) => {
	res.render("sedeLaEsperanza")
})

app.get("/votarSedeLaEsperanza", (req, res) => {
	console.log("GET -> votar votarSedeLaEsperanza" + req.body.gradosSedeLaEsperanza)
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("votarSedeLaEsperanza")
})

app.post("/votarSedeLaEsperanza", (req, res) => {
	console.log("POST -> votar votarSedeLaEsperanza" + req.body.gradosSedeLaEsperanza)

	nom_sede = "LA ESPERANZA"
	num_grado_estudiante = req.body.gradosSedeLaEsperanza

	Votante.
	find( {"vot_sede": nom_sede, "vot_grado":num_grado_estudiante} ).
	select( {_id:0, votante_doc_identificacion:1} ).
	exec( (error, docs) => {
		ids_estudiantes_ya_votaron = obtener_ids_estudiantes_ya_votaron(docs)
	})

	Estudiante.
	find({"est_grado": num_grado_estudiante, "est_nombre_sede": nom_sede}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		estudiantes = docs
		registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
		let sedes = "Listado de estudiantes sede La Esperanza"
		let volver_a = "/sedeLaEsperanza"
		res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
	})

})

// ============================================================================
// Votar en la Sede 4) La Piragua
app.get("/sedeLaPiragua", (req, res) => {
	res.render("sedeLaPiragua")
})

app.get("/votarSedeLaPiragua", (req, res) => {
	console.log("GET -> votar votarSedeLaPiragua" + req.body.gradosSedeLaPiragua)
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("votarSedeLaPiragua")
})

app.post("/votarSedeLaPiragua", (req, res) => {
	console.log("POST -> votar votarSedeLaPiragua" + req.body.gradosSedeLaPiragua)

	nom_sede = "LA PIRAGUA"
	num_grado_estudiante = req.body.gradosSedeLaPiragua

	Votante.
	find( {"vot_sede": nom_sede, "vot_grado":num_grado_estudiante} ).
	select( {_id:0, votante_doc_identificacion:1} ).
	exec( (error, docs) => {
		ids_estudiantes_ya_votaron = obtener_ids_estudiantes_ya_votaron(docs)
	})

	Estudiante.
	find({"est_grado": num_grado_estudiante, "est_nombre_sede": nom_sede}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		estudiantes = docs
		registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
		let sedes = "Listado de estudiantes sede La Piragua"
		let volver_a = "/sedeLaPiragua"
		res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
	})
})

// ============================================================================
// Votar en la Sede 5) Paquies
app.get("/sedePaquies", (req, res) => {
	res.render("sedePaquies")
})

app.get("/votarSedePaquies", (req, res) => {
	console.log("GET -> votar votarSedePaquies" + req.body.gradosSedePaquies)
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("votarSedePaquies")
})

app.post("/votarSedePaquies", (req, res) => {
	console.log("POST -> votar votarSedePaquies" + req.body.gradosSedePaquies)

	nom_sede = "PAQUIES"
	num_grado_estudiante = req.body.gradosSedePaquies

	Votante.
	find( {"vot_sede": nom_sede, "vot_grado":num_grado_estudiante} ).
	select( {_id:0, votante_doc_identificacion:1} ).
	exec( (error, docs) => {
		ids_estudiantes_ya_votaron = obtener_ids_estudiantes_ya_votaron(docs)
	})

	Estudiante.
	find({"est_grado": num_grado_estudiante, "est_nombre_sede": nom_sede}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		estudiantes = docs
		registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
		let sedes = "Listado de estudiantes sede Paquies"
		let volver_a = "/sedePaquies"
		res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
	})
})


// ============================================================================
// Votar en la Sede 6) La Florida
app.get("/sedeLaFlorida", (req, res) => {
	res.render("sedeLaFlorida")
})

app.get("/votarSedeLaFlorida", (req, res) => {
	console.log("GET -> votar votarSedeLaFlorida" + req.body.gradosSedeLaFlorida)
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("votarSedeLaFlorida")
})

app.post("/votarSedeLaFlorida", (req, res) => {
	console.log("POST -> votar votarSedeLaFlorida" + req.body.gradosSedeLaFlorida)

	nom_sede = "LA FLORIDA"
	num_grado_estudiante = req.body.gradosSedeLaFlorida

	Votante.
	find( {"vot_sede": nom_sede, "vot_grado":num_grado_estudiante} ).
	select( {_id:0, votante_doc_identificacion:1} ).
	exec( (error, docs) => {
		ids_estudiantes_ya_votaron = obtener_ids_estudiantes_ya_votaron(docs)
	})

	Estudiante.
	find({"est_grado": num_grado_estudiante, "est_nombre_sede": nom_sede}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		estudiantes = docs
		registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
		let sedes = "Listado de estudiantes sede La Florida"
		let volver_a = "/sedeLaFlorida"
		res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
	})
})

// ============================================================================
// Votar en la Sede 7) Mateo Rico

app.get("/sedeMateoRico", (req, res) => {
	res.render("sedeMateoRico")
})

app.get("/votarSedeMateoRico", (req, res) => {
	console.log("GET -> votar votarSedeMateoRico" + req.body.gradosSedeMateoRico)
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("votarSedeMateoRico")
})

app.post("/votarSedeMateoRico", (req, res) => {
	console.log("POST -> votar votarSedeMateoRico" + req.body.gradosSedeMateoRico)

	nom_sede = "MATEO RICO"
	num_grado_estudiante = req.body.gradosSedeMateoRico

	Votante.
	find( {"vot_sede": nom_sede, "vot_grado":num_grado_estudiante} ).
	select( {_id:0, votante_doc_identificacion:1} ).
	exec( (error, docs) => {
		ids_estudiantes_ya_votaron = obtener_ids_estudiantes_ya_votaron(docs)
	})

	Estudiante.
	find({"est_grado": num_grado_estudiante, "est_nombre_sede": nom_sede}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		estudiantes = docs
		registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
		let sedes = "Listado de estudiantes sede Mateo Rico"
		let volver_a = "/sedeMateoRico"
		res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
	})
})

// ============================================================================
// Votar por Personero
// 
app.post("/personero", (req, res) => {
	// console.log("POST -> personero")
	let est_ID = req.body.documentoIdentidadEstudiante
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("personero", {est_ID, nom_sede})
})


// ============================================================================
// Votar por representante de grado 11
// 
app.post("/representanteGrado11", (req, res) => {
	console.log("GET -> representanteGrado11")
	num_personero = req.body.personero
	res.render("representanteGrado11")
})

// ============================================================================
// Final de votación
// 
app.post("/finalProcesoVotacion", (req, res) => {
	console.log("POST -> finalProcesoVotacion")

	if( nom_sede=="CASCAJAL") { // y grado == "TALES"
		// num_personero = req.body.personero
		num_representante = req.body.representante11
	} else {
		num_personero = req.body.personero
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

	// Guardar en la base de datos de VOTACIONES
	votaciones.save().then( (est) => {	
		console.log("Votación guardada correctamente!") 
	}, (error) => { console.log("Error al escibir en la base de datos. Collection: votaciones") })

	// Guardar en la base de datos de VOTANTES
	votante.save().then( (est) => {
		res.render("finalProcesoVotacion", {nom_sede})
	}, (error) => { res.send("Error al escibir en la base de datos. Collection: votantes") })

})

// ============================================================================
// 		

function obtener_ids_estudiantes_ya_votaron(listaYaVotaron) {
	// Arreglo de numeros de identificación de estudiantes que ya votarion
	var numeros_id_estudiantes = []

	for( let i=0; i<listaYaVotaron.length; i++ ) {
		numeros_id_estudiantes[i] = listaYaVotaron[i].votante_doc_identificacion
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

