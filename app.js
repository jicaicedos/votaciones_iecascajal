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
var num_grupo				// Guarda el grupo al que pertence el estudiante
var num_id_estudiante		// Guarda el número de identificación del estudiante
var num_personero			// Guarda el número del personero votado
var num_representante		// Guarda el número del representante votado

var ruta_foto
var personeros
var ids_estudiantes_ya_votaron = []
var estudiantes = []
var registros_a_bloquear = []

var estudianteCandidato 	// Variable para almacenar temporalmente el estudiante como personero => adicionarPersonero

// ========================================================
// Para cargar los grados correspondientes según el usuario
var id_docente
var grados_docente
var nombre_docente

// ================================================================
// Para reportes
var reporte_personeros
var reporte_representantes
var candidatos_reporte_representante = []
var candidatos_reporte_personero = []


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
	res.render("adicionarEstudiante")
})

/* ==================================================================
						ADMINISTRADOR
================================================================== */
// 
app.get("/administrador", (req, res) => {
	res.render("administrador")
})

// ===========================================================================
// Pagina inicial: index
// 
app.post("/", (req, res) => {
	Usuario.
	find({"usu_ID": req.body.idUsuario, "usu_contraseña": req.body.claveUsuario}).
	select( {usu_nombre:1, usu_sede:1, usu_rol:1}).
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
					nom_sede = docs[0].usu_sede
					console.log("\nBienvenidos a la sede: " + docs[0].usu_sede)
					if( docs[0].usu_sede == "EL TOBO" ) {						
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
						id_docente = req.body.idUsuario
						nombre_docente = docs[0].usu_nombre
						if ( id_docente=="39567986" | id_docente=="36280861" ) {
							grados_docente = 0
						} else if ( id_docente=="1083880333" | id_docente=="83231140" ) {
							grados_docente = 1
						} else if ( id_docente=="22632790" | id_docente=="36274515" ) {
							grados_docente = 2
						} else if ( id_docente=="12232229" | id_docente=="12130633" ) {
							grados_docente = 3
						} else if ( id_docente=="79685926" | id_docente=="1075221503" ) {
							grados_docente = 4
						} else if ( id_docente=="39695420" | id_docente=="36164540" ) {
							grados_docente = 5
						} else if ( id_docente=="93391630" | id_docente=="55183643" ) {
							grados_docente = 6
						}
						res.render("sedeIECascajal", {grados_docente, nombre_docente} )
					} 
				}
			}
		}
	}) 
})

app.get("/", (req, res) => {
	res.render("index")
})


app.get("/reportes", (req, res) => {

	// REPRESENTANTES Consultar candidatos a representantes por grado
	Candidato.
	find({est_nombre_sede: nom_sede, est_tipo_candidato: "representante"}).
	select({ _id:0,
		est_primer_apellido: 1, est_segundo_apellido: 1,
		est_primer_nombre: 1, est_segundo_nombre: 1,
		est_sede:1, est_grado: 1, est_grupo: 1,
		est_num_tarjeton: 1
	}).
	exec( (error, docs) => { candidatos_reporte_representante = docs })

	// PERSONERO: Consultar candidatos a personero
	Candidato.
	find({est_nombre_sede: nom_sede, est_tipo_candidato: "personero"}).
	select({ _id:0,
		est_primer_apellido: 1, est_segundo_apellido: 1,
		est_primer_nombre: 1, est_segundo_nombre: 1,
		est_sede:1, est_grado: 1, est_grupo: 1,
		est_num_tarjeton: 1
	}).
	exec( (error, docs) => { candidatos_reporte_personero = docs })

	// REPRESENTANTE: Odenar los resultados por sede, grupo y representante
	Votaciones.
	aggregate([
		{ $sort: {vot_sede:1, vot_grupo:-1, vot_representante:-1} },
		{ $group: { _id: {sede: "$vot_sede", grupo: "$vot_grupo", representante: "$vot_representante" }, cantidad: { $sum: 1 } } }
	]).
	exec( (error, docs) => {
		reporte_representantes = docs

		establecerNombreReprsentantes(reporte_representantes, candidatos_reporte_representante)

	})

	// PERSONERO: ordenados
	Votaciones.
	aggregate([
		{ $sort: {vot_personero:-1, vot_sede:1, vot_grupo:-1} },
		{ $group: {_id: {sede: "$vot_sede", grupo: "$vot_grupo", personero:"$vot_personero"}, "cantidad": {$sum:1} } }
	]).
	exec( (error, docs) => {
		// Personeros
		reporte_personeros = docs

		establecerNombrePersoneros(reporte_personeros, candidatos_reporte_personero)

		var total_votos_personeros
		total_votos_personeros = obtenerTotalVotosPersonero(candidatos_reporte_personero.length+1)

		// res.send(total_votos_personeros)
		res.render("reportes", {reporte_personeros, reporte_representantes, nom_sede, total_votos_personeros} )
	})
})

function obtenerTotalVotosPersonero(cantidad_personeros) {
	var totales_votos_personeros = new Array(cantidad_personeros)

	for (var i = 0; i < totales_votos_personeros.length; i++) { 
		totales_votos_personeros[i] = 0
		for (var j = 0; j < reporte_personeros.length; j++) {
			if ( i == reporte_personeros[j]._id.personero ) {
				totales_votos_personeros[i] = totales_votos_personeros[i] + reporte_personeros[j].cantidad
			}
			
		}
	}

	return totales_votos_personeros
}


function establecerNombreReprsentantes(reporte_representantes, candidatos_reporte_representante) {
	// Representantes
	for (var i = 0; i < reporte_representantes.length; i++) {
		for (var j = 0; j < candidatos_reporte_representante.length; j++) {
			if(reporte_representantes[i]._id.representante == 0) {
				reporte_representantes[i]._id.nombre_representante = "VOTO EN BLANCO"
			}
			if( reporte_representantes[i]._id.representante == candidatos_reporte_representante[j].est_num_tarjeton &&
				reporte_representantes[i]._id.grupo == candidatos_reporte_representante[j].est_grupo ) 
			{					
				reporte_representantes[i]._id.nombre_representante = candidatos_reporte_representante[j].est_primer_nombre + " " +
															 candidatos_reporte_representante[j].est_segundo_nombre + " " +
															 candidatos_reporte_representante[j].est_primer_apellido + " " +
															 candidatos_reporte_representante[j].est_segundo_apellido
			}
		}
	}
}

function establecerNombrePersoneros(reporte_personeros, candidatos_reporte_personero) {
	for (var i = 0; i < reporte_personeros.length; i++) {
		for (var j = 0; j < candidatos_reporte_personero.length; j++) {
			if(reporte_personeros[i]._id.personero == 0) {
				reporte_personeros[i]._id.nombre_personero = "VOTO EN BLANCO"
			}
			if( reporte_personeros[i]._id.personero == candidatos_reporte_personero[j].est_num_tarjeton )
			{
				reporte_personeros[i]._id.nombre_personero = candidatos_reporte_personero[j].est_primer_nombre + " " +
															 candidatos_reporte_personero[j].est_segundo_nombre + " " +
															 candidatos_reporte_personero[j].est_primer_apellido + " " +
															 candidatos_reporte_personero[j].est_segundo_apellido
			}
		}
	}	
}

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
	var mensaje
	var idEstudiante = req.body.idEstudiante	

	Estudiante.
	find({"est_doc": idEstudiante}).
	select( {est_doc:1} ).
	exec( (error, docs) => { 
		// 1. Verificar que el estudiante está matriculado
		if( docs.length == 1 ) { 
			Candidato.
			find( {"est_doc": idEstudiante} ).
			select().
			exec( (error, docs) => { 
				// 2. Verificar si el candidato ya es un(a) personero(a)/representante
				// == 0 No es candidato
				if( docs.length == 0 ) { 
					// Verificar disponibilidad de número de tarjetón


					Estudiante.
					find({"est_doc": idEstudiante}).
					select({
						est_anio: 1, est_secretaria: 1, est_dane_ie: 1, est_nombre_ie: 1,	
						est_dane_sede: 1, est_nombre_sede: 1, est_jornada: 1, est_calendario: 1,
						est_grado: 1, est_sector: 1, est_grupo: 1, est_modelo_educativo: 1,
						est_tipo_identificacion: 1, est_doc: 1, est_primer_apellido: 1,
						est_segundo_apellido: 1, est_primer_nombre: 1, est_segundo_nombre: 1,
						est_estado: 1, est_matricula_contratada: 1, est_fuente_recursos: 1
					}).
					exec( (error, docs) => {
						estudianteCandidato = docs[0]
						res.render("consultarEstudianteParaCandidato", {estudianteCandidato})
					})

				} else {
					mensaje = "Este(a) estudiante ya tiene candidatura"
					res.render("adicionarCandidato", {mensaje})
				}
			})
		} else {
			mensaje = "Este(a) estudiante no está matriculado en la Institución Educativa."
			res.render("adicionarCandidato", {mensaje})			
		}
	})
})

app.post("/finalAdicionarCandidato", (req, res) => {
	let grado = estudianteCandidato.est_grado
	let grupo = estudianteCandidato.est_grupo
	let number_tarjeton = req.body.numeroTarjeton
	let tipo_candidato = req.body.tipo_candidato

	var est_candidato = new Candidato({
		est_anio: estudianteCandidato.est_anio,
		est_secretaria: estudianteCandidato.est_secretaria,
		est_dane_ie: estudianteCandidato.est_dane_ie,
		est_nombre_ie: estudianteCandidato.est_nombre_ie,
		est_dane_sede: estudianteCandidato.est_dane_sede,
		est_nombre_sede: estudianteCandidato.est_nombre_sede,
		est_jornada: estudianteCandidato.est_jornada,
		est_calendario: estudianteCandidato.est_calendario,
		est_grado: estudianteCandidato.est_grado,
		est_sector: estudianteCandidato.est_sector,
		est_grupo: estudianteCandidato.est_grupo,
		est_modelo_educativo: estudianteCandidato.est_modelo_educativo,
		est_tipo_identificacion: estudianteCandidato.est_tipo_identificacion,
		est_doc: estudianteCandidato.est_doc,
		est_primer_apellido: estudianteCandidato.est_primer_apellido,
		est_segundo_apellido: estudianteCandidato.est_segundo_apellido,
		est_primer_nombre: estudianteCandidato.est_primer_nombre,
		est_segundo_nombre: estudianteCandidato.est_segundo_nombre,
		est_estado: estudianteCandidato.est_estado,
		est_matricula_contratada: estudianteCandidato.est_matricula_contratada,
		est_fuente_recursos: estudianteCandidato.est_fuente_recursos,
		est_tipo_candidato: req.body.tipo_candidato,
		est_num_tarjeton: req.body.numeroTarjeton,
		est_foto: req.body.fotoEstudiante
	})


	Candidato.
	find( {"est_grado":grado, "est_grupo":grupo, "est_num_tarjeton":number_tarjeton, "est_tipo_candidato":tipo_candidato} ).
	select( {est_grado:1, est_grupo:1, est_num_tarjeton:1, est_tipo_candidato:1} ).
	exec( (error, docs) => {
		if( docs.length >= 1 ) {
			mensaje = "Ya existe un candidato del mismo grado y grupo con el número de tarjetón seleccionado"
			res.render("consultarEstudianteParaCandidato", {estudianteCandidato, mensaje})
		}
		else {	
			est_candidato.save().then( (est) => {
				res.render("finalAdicionarCandidato")
			}, (error) => {
				let mensaje = "No se guardó el registro, por favor intentarlo de nuevo."
				res.render("finalAdicionarCandidato", {mensaje})
			})
		}

	})
})

// ===========================================================================
// Consultar estudiante para votar


// Consultar estudiantes SOLO IE CASCAJAL
app.get("/consultarEstudiantes", (req, res) => {
	Estudiante.
	find({}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		estudiantes = docs
		res.render("consultarEstudiantes", {estudiantes} )
	})
})

app.get("/estudiantesIECascajal", (req, res) => {
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
	sort({est_grupo:1, est_num_tarjeton:1}).
	exec( (error, docs) => {
		let candidatos = docs
		if( docs.length == 0 ) {
			mensaje = "No hay candidatos inscritos"
			mensajeOK = "VACIO"
			res.render("consultarCandidatos", {mensaje, mensajeOK})
		} else {
			mensajeOK = "OK"
			res.render("consultarCandidatos", {candidatos, mensajeOK})
		}		
	}, (error) => {
		mensajeOK = "ERROR"
		mensaje = "No se pudo leer los datos de los candidatos, por favor intentar nuevamente"		
		res.render("consultarCandidatos", {mensaje, mensajeOK} )
	})
})

// ============================================================================
// Votar en la I.E. Cascajal
app.get("/sedeIECascajal", (req, res) => {
	res.render("sedeIECascajal", {nombre_docente, grados_docente})
})

app.get("/votarIECascajal", (req, res) => {
	res.render("votarIECascajal")
})

app.post("/votarIECascajal", (req, res) => {
	nom_sede = "CASCAJAL"
	num_grado_estudiante = req.body.gradosIECascajal

	if( num_grado_estudiante=="SEXTO A" | num_grado_estudiante=="SEXTO B" | num_grado_estudiante=="OCTAVO A" | num_grado_estudiante=="OCTAVO B" ) {

		if( num_grado_estudiante=="SEXTO A" ) {
			num_grado_estudiante = num_grado_estudiante.split(" ")[0]
			num_grupo = 601
		} else if( num_grado_estudiante=="SEXTO B" ) {
			num_grado_estudiante = num_grado_estudiante.split(" ")[0]
			num_grupo = 602
		} else if( num_grado_estudiante=="OCTAVO A" ) {
			num_grado_estudiante = num_grado_estudiante.split(" ")[0]
			num_grupo = 801
		} else {
			num_grado_estudiante = num_grado_estudiante.split(" ")[0]
			num_grupo = 802
		}
		// num_grado_estudiante = num_grado_estudiante.split(" ")[0]
		// num_grupo = 802
		
		Votante.
		find( {"vot_sede": nom_sede, "vot_grado": num_grado_estudiante} ).
		select( {_id:0, vot_doc:1} ).
		exec( (error, docs) => {
			ids_estudiantes_ya_votaron = obtener_ids_estudiantes_ya_votaron(docs)
		})

		Estudiante.
		find({"est_grupo": num_grupo, "est_nombre_sede": "CASCAJAL"}).
		select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
		exec( (error, docs) => {
			estudiantes = docs
			registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
			let sedes = "Listado de estudiantes sede I. E. Cascajal"
			let volver_a = "/sedeIECascajal"
			res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
		})		
	} else {
		Votante.
		find({"vot_sede": nom_sede, "vot_grado":num_grado_estudiante}).
		select( {_id:0, vot_doc:1} ).
		exec( (error, docs) => {
			ids_estudiantes_ya_votaron = obtener_ids_estudiantes_ya_votaron(docs)
		})

		Estudiante.
		find({"est_grado": num_grado_estudiante, "est_nombre_sede": "CASCAJAL"}).
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
	// console.log("GET -> votar votarSedeElTobo" + req.body.gradosSedeElTobo)
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("listarEstudiantesVotacion")
})

app.post("/votarSedeElTobo", (req, res) => {
	// console.log("POST -> votar votarSedeElTobo" + req.body.gradosSedeElTobo)

	nom_sede = "EL TOBO"
	num_grado_estudiante = req.body.gradosSedeElTobo

	Votante.
	find( {"vot_sede": nom_sede, "vot_grado":num_grado_estudiante} ).
	select( {_id:0, vot_doc:1} ).
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
	// console.log("GET -> votar votarSedeLaEsperanza" + req.body.gradosSedeLaEsperanza)
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("votarSedeLaEsperanza")
})

app.post("/votarSedeLaEsperanza", (req, res) => {
	// console.log("POST -> votar votarSedeLaEsperanza" + req.body.gradosSedeLaEsperanza)

	nom_sede = "LA ESPERANZA"
	num_grado_estudiante = req.body.gradosSedeLaEsperanza

	Votante.
	find( {"vot_sede": nom_sede, "vot_grado":num_grado_estudiante} ).
	select( {_id:0, vot_doc:1} ).
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
	// console.log("GET -> votar votarSedeLaPiragua" + req.body.gradosSedeLaPiragua)
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("votarSedeLaPiragua")
})

app.post("/votarSedeLaPiragua", (req, res) => {
	// console.log("POST -> votar votarSedeLaPiragua" + req.body.gradosSedeLaPiragua)

	nom_sede = "LA PIRAGUA"
	num_grado_estudiante = req.body.gradosSedeLaPiragua

	Votante.
	find( {"vot_sede": nom_sede, "vot_grado":num_grado_estudiante} ).
	select( {_id:0, vot_doc:1} ).
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
	// console.log("GET -> votar votarSedePaquies" + req.body.gradosSedePaquies)
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("votarSedePaquies")
})

app.post("/votarSedePaquies", (req, res) => {
	// console.log("POST -> votar votarSedePaquies" + req.body.gradosSedePaquies)

	nom_sede = "PAQUIES"
	num_grado_estudiante = req.body.gradosSedePaquies

	Votante.
	find( {"vot_sede": nom_sede, "vot_grado":num_grado_estudiante} ).
	select( {_id:0, vot_doc:1} ).
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
	// console.log("GET -> votar votarSedeLaFlorida" + req.body.gradosSedeLaFlorida)
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("votarSedeLaFlorida")
})

app.post("/votarSedeLaFlorida", (req, res) => {
	// console.log("POST -> votar votarSedeLaFlorida" + req.body.gradosSedeLaFlorida)

	nom_sede = "LA FLORIDA"
	num_grado_estudiante = req.body.gradosSedeLaFlorida

	Votante.
	find( {"vot_sede": nom_sede, "vot_grado":num_grado_estudiante} ).
	select( {_id:0, vot_doc:1} ).
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
	// console.log("GET -> votar votarSedeMateoRico" + req.body.gradosSedeMateoRico)
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("votarSedeMateoRico")
})

app.post("/votarSedeMateoRico", (req, res) => {
	// console.log("POST -> votar votarSedeMateoRico" + req.body.gradosSedeMateoRico)

	nom_sede = "MATEO RICO"
	num_grado_estudiante = req.body.gradosSedeMateoRico

	Votante.
	find( {"vot_sede": nom_sede, "vot_grado":num_grado_estudiante} ).
	select( {_id:0, vot_doc:1} ).
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
	num_id_estudiante = req.body.documentoIdentidadEstudiante

	// Obtenemos los personeros desde la base de datos
	Candidato.
	find({"est_tipo_candidato":"personero"}).
	sort({est_num_tarjeton:1}).
	select({
		est_anio: 1, est_secretaria: 1, est_dane_ie: 1, est_nombre_ie: 1,	
		est_dane_sede: 1, est_nombre_sede: 1, est_jornada: 1, est_calendario: 1,
		est_grado: 1, est_sector: 1, est_grupo: 1, est_modelo_educativo: 1,
		est_tipo_identificacion: 1, est_doc: 1, est_primer_apellido: 1,
		est_segundo_apellido: 1, est_primer_nombre: 1, est_segundo_nombre: 1,
		est_estado: 1, est_matricula_contratada: 1, est_fuente_recursos: 1,
		est_tipo_candidato: 1, est_num_tarjeton: 1, est_foto: 1
	}).
	exec( (error, docs) => {
		personeros = docs

		Estudiante.
		find({"est_doc":num_id_estudiante}).
		select({est_grado:1, est_grupo:1}).
		exec( (error, docs) => {
			num_grado_estudiante = docs[0].est_grado
			num_grupo = docs[0].est_grupo		
			// Variable para determinar cuales grados tienen representante
			let conRepresentante
			if( num_grupo >= 299 ) {
				conRepresentante = 1
				res.render("personero", {personeros, num_id_estudiante, nom_sede, num_grado_estudiante, conRepresentante})
			} else {
				conRepresentante = 0
				res.render("personero", {personeros, num_id_estudiante, nom_sede, num_grado_estudiante, conRepresentante})
			}
		})
	})	
})


// ============================================================================
// Votar por representante de grado 11
// 
app.post("/representante", (req, res) => {
	num_personero = req.body.personero

	// Obtenemos los representantes desde la base de datos
	Candidato.
	find({"est_tipo_candidato":"representante", "est_grado":num_grado_estudiante, "est_grupo":num_grupo}).
	sort({est_num_tarjeton:1}).
	select({
		est_anio: 1, est_secretaria: 1, est_dane_ie: 1, est_nombre_ie: 1,	
		est_dane_sede: 1, est_nombre_sede: 1, est_jornada: 1, est_calendario: 1,
		est_grado: 1, est_sector: 1, est_grupo: 1, est_modelo_educativo: 1,
		est_tipo_identificacion: 1, est_doc: 1, est_primer_apellido: 1,
		est_segundo_apellido: 1, est_primer_nombre: 1, est_segundo_nombre: 1,
		est_estado: 1, est_matricula_contratada: 1, est_fuente_recursos: 1,
		est_tipo_candidato: 1, est_num_tarjeton: 1, est_foto: 1
	}).
	exec( (error, docs) => {
		representantes = docs
		res.render("representante", {representantes, num_grado_estudiante, num_grupo})
	})
	// res.render("representante")
})


// ============================================================================
// 		

function obtener_ids_estudiantes_ya_votaron(listaYaVotaron) {
	// Arreglo de numeros de identificación de estudiantes que ya votarion
	var numeros_id_estudiantes = []

	for( let i=0; i<listaYaVotaron.length; i++ ) {
		numeros_id_estudiantes[i] = listaYaVotaron[i].vot_doc
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

// ============================================================================
function reportePersoneroConNombre(reporte_personeros, candidatos_reporte_personero) {
	let resultado = []
	for (var i = 0; i < reporte_personeros.length; i++) {
		for (var i = 0; i < candidatos_reporte_personero.length; i++) {
			if( reporte_personeros[i].vot_sede == candidatos_reporte_personero ) {

			}
		}	
		
	}
}

// ============================================================================
// Final de votación
// 
app.post("/finalProcesoVotacion", (req, res) => {
	// console.log("POST -> finalProcesoVotacion")

	if( nom_sede=="CASCAJAL"  ) { // y grado == "TALES"		
		if( num_grupo < 300 ) {
			num_representante = -1
		} else {
			num_representante = req.body.representante
		}		
	} else {
		num_personero = req.body.personero
		num_representante = -1
	}

	var votaciones = new Votaciones({
	    vot_sede: nom_sede,
	    vot_grado: num_grado_estudiante,
	    vot_grupo: num_grupo,
	    vot_personero: num_personero,
	    vot_representante: num_representante,
	    vot_fecha: new Date()
	});

	var votante = new Votante({
	    vot_sede: nom_sede,
	    vot_grado: num_grado_estudiante,
	    vot_doc: num_id_estudiante,
	    vot_fecha: new Date()
	});

	// console.log(votaciones)

	// Guardar en la base de datos de VOTACIONES
	votaciones.save().then( (est) => {	
		// console.log("Votación guardada correctamente!") 
	}, (error) => { console.log("Error al escibir en la base de datos. Collection: votaciones") })

	// Guardar en la base de datos de VOTANTES
	votante.save().then( (est) => {
		res.render("finalProcesoVotacion", {nom_sede})
	}, (error) => { res.send("Error al escibir en la base de datos. Collection: votantes") })

})



app.listen(8080)

