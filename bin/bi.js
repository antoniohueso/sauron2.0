"use strict";
const util_1 = require("./util");
const config_1 = require("./config");
const moment = require("moment");
const _ = require("lodash");
const repository_1 = require("./repository");
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
function normalizeIssues(issues) {
    const issuesIds = _.map(issues, issue => issue.id);
    const issuesIdx = _.groupBy(issues, "id");
}
util_1.database.query("Select * from issues where project_key = 'SC'")
    .then(issues => {
    repository_1.repository.completeIssueInfo(issues).then(issues => {
        issues.forEach(issue => {
            console.log(issue);
        });
        util_1.database.shutdown();
    });
}).catch(err => {
    console.log(err);
});
