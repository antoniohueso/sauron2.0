import {HttpClient} from 'aurelia-fetch-client';
import * as Promise from "bluebird";
import * as _ from "lodash";

function __acum(o,issue) {
    o.total ++;
    o.ph += issue.puntos_historia;
    o.completadas += issue.status_completado == 1 ? 1 : 0;
    o.phcompletados += issue.status_completado == 1 ? issue.puntos_historia : 0;

    return o;
}

class BIData {

    //Hacer un GROUP BY por la propiedad haciendo un summary completo con totales %, etc

    static summaryOf(prop,issues) {
        if(issues == null) return {};

        const issuesCompletadas = _.chain(issues).filter({status_completado:1}).value();


    }


}

