"use strict";
const elasticsearch = require("elasticsearch");
const client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});
console.log("Mierda!");
client.search({
    index: 'jira',
    body: {
        query: {
            match: { "components.name": "regonline" }
        }
    }
}).then(r => {
    const result = r;
    result.hits.hits.forEach((issue) => {
        console.log(issue._source.components);
    });
});
