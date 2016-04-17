import {observable} from "mobx";
import "whatwg-fetch";
import * as Promise from "bluebird";

export class SprintStore {

    @observable sprint:any;

    findSprint(projectKey:string, sprintId:number) {
        Promise.all([
            fetch(`/rest/sprint/${sprintId}`).then(r => r.json()),
            fetch(`/rest/project/${projectKey}`).then(r => r.json())
        ]).then(results => {
            console.log(results);
        });

    }

}