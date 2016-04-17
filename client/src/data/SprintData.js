import {HttpClient} from 'aurelia-fetch-client';
import * as Promise from "bluebird";
import * as _ from "lodash";

class SprintData {

    sprint;

    project;

    issues;

    constructor(project,sprint,issues) {
        this.project = project;
        this.issues = issues;
        this.sprint = sprint;
        this.__completeSprint();
    }


    __completeSprint() {

        this.sprint.tareas = { total: 0, ph:0, completadas:0,phcompletados:0 };
        this.sprint.incidencias = { total: 0, ph:0, completadas:0,phcompletados:0 };
        this.sprint.historias = { total: 0, ph:0, completadas:0,phcompletados:0 };

        this.sprint = this.issues.reduce((sp,issue) => {

            sp.tareas = this.__acum(sp.tareas,issue);

            if(issue.issuetype_name == 'Incidencia') {
                sp.incidencias = this.__acum(sp.incidencias,issue);
            }
            else {
                sp.historias = this.__acum(sp.historias,issue);
            }

            return sp;
        },this.sprint);

        this.sprint.percJornadasTranscurridas = Math.round(((this.sprint.jornadas - this.sprint.jornadas_pendientes) * 100) / this.sprint.jornadas);
        this.sprint.percTotalPuntosHistoriaCompletados = Math.round((this.sprint.tareas.phcompletados * 100) / this.sprint.tareas.ph);

    }

    __acum(o,issue) {
        o.total ++;
        o.ph += issue.puntos_historia;
        o.completadas += issue.status_completado == 1 ? 1 : 0;
        o.phcompletados += issue.status_completado == 1 ? issue.puntos_historia : 0;

        return o;
    }

}


export const sprintData = (projectKey,sprintId) => {
    const http = new HttpClient();

    return Promise.all([
        http.fetch(`/rest/project/${projectKey}`).then(r => r.json()),
        http.fetch(`/rest/sprint/${sprintId}`).then(r => r.json()),
        http.fetch(`/rest/sprint/${sprintId}/issues`).then(r => r.json())
    ]).then(result => {
        return new SprintData(result[0],result[1],result[2]);
    }).catch(e => {
        console.log("Errrror: ",e);
    });
}

