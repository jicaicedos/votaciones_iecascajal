var express = require('express')

var app = express()

// Parametro 
// "/" va al raiz
// req: petición
// res: respuesta

app.get("/", function(req, res) {
	res.send("Hola mundo...")
})

app.listen(8080)