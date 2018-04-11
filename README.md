# votaciones_iecascajal
Nueva version de votaciones IE Cascajal - 2018

### Probado en Windows 8/10

Sistema para realizar las elecciones estudiantiles en Instituciones Educativas 

Para probar el sistema es necesario tener instalado Node.js y MongoDB

Se debe guardar la el directorio "votaciones_iecascajal" en la partición C: del disco duro de su equipo

* * *

Los pasos para ejecutar por primera vez el sistema son:

### 1. Crear directorios/carpetas para MongoDB

Mediante el comando:  

 > md \data\db

### 2. Iniciar el servidor de MongoDB

 > c:/\"Program Files\"/MongoDB/Server/3.2/bin/mongod

### 3. Iniciar la aplicación 

> "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe" "http://localhost:8080"

 > node c:/votaciones_iecascajal/app.js

* * *

### Para ello en este repositorio se han incluidos los archivos .bat enumerados así:

(Para ejecutarlos solo debes dar doble clic sobre cada archivo .bat)

paso 0 - crear_data_db.bat

paso 1 - iniciar_servidor.bat

### Luego debes ejecutar el archivo: 

iniciar_cliente_mongo.bat

Una vez inicie el cliente de MongoDB, se debe copiar y pegar los comandos del archivo: "db_TODO.sql" donde se encuentra todos los datos de la base de datos y esperar a que se guarden los datos de los "estudiantes", "candidatos" y "usuarios" 

paso 2 - iniciar_app.bat



