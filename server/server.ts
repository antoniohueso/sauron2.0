///<reference path='../typings/main.d.ts' />

import * as express from "express";
import * as path from "path";
import {logger,loggerStream,database} from "./util";
import {config} from "./config";
import * as Promise from "bluebird";
import * as morgan from "morgan";
import {router as sprintRouterRest} from "./router-rest-sprint";
import {router as projectRouterRest} from "./router-rest-project";
const moment = require("moment");

moment.locale("es");

export const app:any = express();

/**********************************************************************************************************************
 * Logger
 **********************************************************************************************************************/
logger.debug("Overriding 'Express' logger");
app.use(morgan("combined",{ "stream": loggerStream }));


/**********************************************************************************************************************
 * Se conecta a la base de datos
 **********************************************************************************************************************/
if(process.env.NODE_ENV == "production") {
    database.connect(config.database.prod);
}
else {
    database.connect(config.database.dev);
}


/**********************************************************************************************************************
 * Configuración de rutas
 **********************************************************************************************************************/

app.use(express.static('client'));

//---- Rutas Rest
app.use("/rest/sprint",sprintRouterRest);
app.use("/rest/project",projectRouterRest);

//--- El resto lo redirige de nuevo a la página de cliente
app.get('*', function (request, response){
    response.sendFile(path.resolve(__dirname, '../client', 'index.html'))
})




/**********************************************************************************************************************
 * Servidor
 **********************************************************************************************************************/
app.listen(process.env.NODE_PORT || 3000, () => {
    logger.info(`Sauron 2.0 server arrancado en el puerto ${process.env.NODE_PORT || 3000} en modo: ${!process.env.NODE_ENV?'DEVELOPMENT':process.env.NODE_ENV.toUpperCase()}`);
});


const arr = [];

import * as Promise from "bluebird";

for(let i = 0 ; i < 10; i++) {
    arr.push(database.query("Select * from issues"));
}

Promise.all(arr).then(issues => {
    console.log(issues.length);
});
