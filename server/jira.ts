import {config}  from "./config";
import * as moment from "moment";
import * as Promise from "bluebird";
import * as _ from "lodash";
const fetch = require("node-fetch");


class JiraRest {

    jiraUrlBase:string;

    headers:any = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    constructor(jiraUrlBase:string) {
        this.jiraUrlBase = jiraUrlBase;
    }

    login(username,password) {
        return this.fetch("/auth/1/session",{
            username:username,
            password:password
        })
            .then((res:any) => {
                this.headers.Cookie = res.session.name + "=" + res.session.value;
                return res;
            });

    }

    get(url,data) {
        return fetch(this.jiraUrlBase + url, {
            method: "GET",
            headers: this.headers,
            body: data
        }).then(r => r.json());
    }

    fetch(url,data) {
        return fetch(this.jiraUrlBase + url, {
            method: data?"POST":"GET",
            headers: this.headers,
            body: data?JSON.stringify(data):null
        }).then(r => r.json());
    }

    search(jql:string,maxResults?:number) {

        maxResults = maxResults || 50;

        const data:any = {
            jql: jql,
            startAt: 0,
            maxResults: maxResults,
            expand:[ "changelog" ],
            fields: [
                "*all"
            ]
        }

        return this.fetch("/api/2/search",data).then((r:any) => {

            r.total -= maxResults;

            if(r.total <= maxResults) return r.issues.map(rissue => {
                rissue.fields["issuekey"] = rissue.key;
                return rissue.fields;
            });

            const nloop = Math.floor((r.total / maxResults)) + (r.total % maxResults > 0 ? 1 : 0);

            const promises = [];

            for(let i = 0 ; i < nloop; i++ ) {
                promises.push(this.fetch("/api/2/search",{
                    jql: jql,
                    startAt: maxResults * (i+1),
                    maxResults: maxResults,
                    fields: [
                        "*all"
                    ],
                    expand: [ "changelog"]
                }));
            }

            const rdata = r.issues.map(rissue => {
                rissue.fields["issuekey"] = rissue.key;
                return rissue.fields;
            });

            return Promise.all(promises).then(results => {

                results.forEach(r => {
                    rdata.concat(r.map((rissue:any) => {
                        rissue.issues.fields["issuekey"] = rissue.issuekey;
                        return rissue.fields;
                    }));
                });
                return rdata;
            });

        });

    }



}

const jira = new JiraRest(config.jiraUrl);

jira.login("ahg","12345").then(res => {

    console.log("Si!");

    jira.fetch("/api/2/issue/GI-8?expand=changelog",null).then(r => {
        console.log("PAHA", r.changelog.total);
    })

    /*
    jira.search("project = SC and issuekey = SC-485",200).then(res =>{
        console.log(res);
    })*/
}).catch(err => {
    console.log("ERROR: ",err);
});

/*
fetch(config.jiraUrl + "/auth/1/session",
    {
        method: 'POST',
        body: JSON.stringify({
            username:'ahg',
            password:'12345'
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

    })
    .then(res => res.json())
    .then((res:any) =>{

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        headers["Cookie"] = res.session.name + "=" + res.session.value;

        console.log(headers);

        return fetch(config.jiraUrl + "/auth/1/session",{
            headers: headers
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
            });


}).catch(err => {
    console.log("Error ",err);
});
*/