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

/*
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



database.query("Select * from issues where project_key = ?",[projectKey])
    .then(issues => {

        const issuesIds:Array<number> = _.map(issues, issue => issue.id);
        const issuesIdx:any = _.groupBy(issues, "id");

        repository.completeIssueInfo(issues).then(issues => {

            database.shutdown();

            const arr = issues.map(issue => {
                client.create({
                    index: 'jira',
                    type: 'issues',
                    id: issue.id,
                    body: issue
                })
            });

            return Promise.all(arr).then(r => {
                console.log("Total: ",r.length);
            })

        });


    }).catch(err => {
    console.log(err);
});
*/

console.log("Mierda!");

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
