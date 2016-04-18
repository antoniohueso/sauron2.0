import {database} from "./util";
import {config} from "./config";
import * as moment from "moment";
import * as Promise from "bluebird";
import * as _ from "lodash";
import {repository} from "./repository";

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



database.query("Select * from issues where project_key = ? and updated between ? and ?",[projectKey,desde.toDate(),hasta.toDate()])
    .then(issues => {

        const issuesIds:Array<number> = _.map(issues, issue => issue.id);
        const issuesIdx:any = _.groupBy(issues, "id");

        repository.completeIssueInfo(issues).then(issues => {
            issues.filter(issue => issue.versions.length > 2).forEach(issue => {
                console.log(issue)
            });


            database.shutdown();
        });


}).catch(err => {
    console.log(err);
});

