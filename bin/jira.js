"use strict";
const config_1 = require("./config");
const Promise = require("bluebird");
const _ = require("lodash");
const fetch = require("node-fetch");
const querystring = require("querystring");
class JiraRest {
    constructor(jiraUrlBase) {
        this.headers = {
            'Content-Type': 'application/json'
        };
        this.jiraUrlBase = jiraUrlBase;
    }
    login(username, password) {
        return this.post("/auth/1/session", {
            username: username,
            password: password
        })
            .then((res) => {
            this.headers.Cookie = res.session.name + "=" + res.session.value;
            return res;
        });
    }
    get(url, data) {
        console.log(this.jiraUrlBase + url + (data ? "?" + querystring.encode(data) : ""));
        return fetch(this.jiraUrlBase + url + (data ? "?" + querystring.encode(data) : ""), {
            headers: this.headers
        }).then(r => r.json());
    }
    post(url, data) {
        return fetch(this.jiraUrlBase + url, {
            method: "POST",
            headers: this.headers,
            body: data ? JSON.stringify(data) : null
        }).then(r => r.json());
    }
    search(jql, pmaxResults) {
        const maxResults = pmaxResults || 200;
        const data = {
            jql: jql,
            startAt: 0,
            maxResults: maxResults,
            expand: ["changelog"],
            fields: [
                "*all"
            ]
        };
        return this.post("/api/2/search", data).then((r) => {
            const rdata = this._normalizeIssues(r.issues);
            if (r.total <= maxResults)
                return rdata;
            const nloop = Math.floor((r.total / maxResults)) + (r.total % maxResults > 0 ? 1 : 0);
            const promises = [];
            for (let i = 1; i < nloop; i++) {
                const odata = _.clone(data);
                odata.startAt = maxResults * i;
                promises.push(this.post("/api/2/search", odata));
            }
            return Promise.all(promises).then(results => {
                return rdata.concat(_.chain(results).map((r) => this._normalizeIssues(r.issues)).flatten().value());
            });
        });
    }
    _normalizeIssues(rissues) {
        if (!rissues)
            return;
        return rissues.map((rissue) => {
            const issue = rissue.fields;
            issue.issuekey = rissue.key;
            issue.changelog = rissue.changelog;
            return issue;
        });
    }
    _normalizeSprints(issue) {
        issue.sprints = _.map(issue.customfield_10005);
    }
}
const jira = new JiraRest(config_1.config.jiraUrl);
jira.login("ahg", "12345").then(res => {
    console.log("Si!");
    return jira.search("issuekey = SC-491").then(res => {
        res[0].changelog.histories.forEach(h => {
        });
    });
}).catch(err => {
    console.log("ERROR: ", err);
});
