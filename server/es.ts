import {database} from "./util";
import {config} from "./config";
import * as moment from "moment";
import * as Promise from "bluebird";
import * as _ from "lodash";
import {repository} from "./repository";

const elasticsearch = require("elasticsearch");

const client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

if (process.env.NODE_ENV == "production") {
    database.connect(config.database.prod);
}
else {
    database.connect(config.database.dev);
}

const projectKey = "SC";
const desde = moment(new Date());
const hasta = moment(new Date());

desde.subtract(5,  'month');

database.query("Select * from issues where project_key = 'SC'")
    .then(issues => {

        repository.completeIssueInfo(issues).then(issues => {

            const promises = issues.map(issue => {
                client.index({
                    index: 'jira',
                    type: 'issues',
                    id: issue.id,
                    body: issue
                })
            });

            return Promise.all(promises).then(r => {
                console.log("Total: ",r.length);
            })

            database.shutdown();
        });


    }).catch(err => {
    console.log(err);
});

/*
client.search({
    index: 'jira',
    body: {
        query: {
            match: {"components.name": "regonline"}
        }
    }
}).then(r => {
    const result:any = r;

    result.hits.hits.forEach((issue:any) => {

        console.log(issue._source.components);
    });
});
*/