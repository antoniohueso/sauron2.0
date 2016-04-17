"use strict";
const express = require("express");
const path = require("path");
const util_1 = require("./util");
const config_1 = require("./config");
const morgan = require("morgan");
const router_rest_sprint_1 = require("./router-rest-sprint");
const router_rest_project_1 = require("./router-rest-project");
const moment = require("moment");
moment.locale("es");
exports.app = express();
util_1.logger.debug("Overriding 'Express' logger");
exports.app.use(morgan("combined", { "stream": util_1.loggerStream }));
if (process.env.NODE_ENV == "production") {
    util_1.database.connect(config_1.config.database.prod);
}
else {
    util_1.database.connect(config_1.config.database.dev);
}
exports.app.use(express.static('client'));
exports.app.use("/rest/sprint", router_rest_sprint_1.router);
exports.app.use("/rest/project", router_rest_project_1.router);
exports.app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../client', 'index.html'));
});
exports.app.listen(process.env.NODE_PORT || 3000, () => {
    util_1.logger.info(`Sauron 2.0 server arrancado en el puerto ${process.env.NODE_PORT || 3000} en modo: ${!process.env.NODE_ENV ? 'DEVELOPMENT' : process.env.NODE_ENV.toUpperCase()}`);
});
