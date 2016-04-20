"use strict";
const util_1 = require("./util");
const config_1 = require("./config");
const moment = require("moment");
const Promise = require("bluebird");
const repository_1 = require("./repository");
const elasticsearch = require("elasticsearch");
const client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});
if (process.env.NODE_ENV == "production") {
    util_1.database.connect(config_1.config.database.prod);
}
else {
    util_1.database.connect(config_1.config.database.dev);
}
const projectKey = "SC";
const desde = moment(new Date());
const hasta = moment(new Date());
desde.subtract(5, 'month');
util_1.database.query("Select * from issues where project_key = 'SC'")
    .then(issues => {
    repository_1.repository.completeIssueInfo(issues).then(issues => {
        const promises = issues.map(issue => {
            client.index({
                index: 'jira',
                type: 'issues',
                id: issue.id,
                body: issue
            });
        });
        return Promise.all(promises).then(r => {
            console.log("Total: ", r.length);
        });
        util_1.database.shutdown();
    });
}).catch(err => {
    console.log(err);
});
