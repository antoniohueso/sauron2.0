"use strict";
const config_1 = require("./config");
const Promise = require("bluebird");
const fetch = require("node-fetch");
class JiraRest {
    constructor(jiraUrlBase) {
        this.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        this.jiraUrlBase = jiraUrlBase;
    }
    login(username, password) {
        return this.fetch("/auth/1/session", {
            username: username,
            password: password
        })
            .then((res) => {
            this.headers.Cookie = res.session.name + "=" + res.session.value;
            return res;
        });
    }
    get(url, data) {
        return fetch(this.jiraUrlBase + url, {
            method: "GET",
            headers: this.headers,
            body: data
        }).then(r => r.json());
    }
    fetch(url, data) {
        return fetch(this.jiraUrlBase + url, {
            method: data ? "POST" : "GET",
            headers: this.headers,
            body: data ? JSON.stringify(data) : null
        }).then(r => r.json());
    }
    search(jql, maxResults) {
        maxResults = maxResults || 50;
        const data = {
            jql: jql,
            startAt: 0,
            maxResults: maxResults,
            expand: ["changelog"],
            fields: [
                "*all"
            ]
        };
        return this.fetch("/api/2/search", data).then((r) => {
            r.total -= maxResults;
            if (r.total <= maxResults)
                return r.issues.map(rissue => {
                    rissue.fields["issuekey"] = rissue.key;
                    return rissue.fields;
                });
            const nloop = Math.floor((r.total / maxResults)) + (r.total % maxResults > 0 ? 1 : 0);
            const promises = [];
            for (let i = 0; i < nloop; i++) {
                promises.push(this.fetch("/api/2/search", {
                    jql: jql,
                    startAt: maxResults * (i + 1),
                    maxResults: maxResults,
                    fields: [
                        "*all"
                    ],
                    expand: ["changelog"]
                }));
            }
            const rdata = r.issues.map(rissue => {
                rissue.fields["issuekey"] = rissue.key;
                return rissue.fields;
            });
            return Promise.all(promises).then(results => {
                results.forEach(r => {
                    rdata.concat(r.map((rissue) => {
                        rissue.issues.fields["issuekey"] = rissue.issuekey;
                        return rissue.fields;
                    }));
                });
                return rdata;
            });
        });
    }
}
const jira = new JiraRest(config_1.config.jiraUrl);
jira.login("ahg", "12345").then(res => {
    console.log("Si!");
    jira.fetch("/api/2/issue/GI-8?expand=changelog", null).then(r => {
        console.log("PAHA", r.changelog.total);
    });
}).catch(err => {
    console.log("ERROR: ", err);
});
