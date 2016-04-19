import {checkNotFound,checkNotNull,logger, database} from "./util";
import {IQuery} from "mysql";
import * as Promise from "bluebird";
import * as _ from "lodash";

class Repository {

    /**
     * Retorna los cambios de estado de un grupo de tareas en una fecha determinada
     * @param aIssuesId
     * @returns {Promise<Array<any>>}
     */
    findChangeLogStatusOfIssues(aIssuesId:Array<any>) {
        checkNotNull("aIssuesId",aIssuesId);
        return database.query("select * from issuechangelog where issue_id in(?) and type = 'status' order by created", [aIssuesId]);
    }

    /**
     * Retorna los cambios realizados en los sprints para un grupo de tareas. En ellos se refleja cuando se añade o se elimina la
     * tarea del sprint.
     * @param aIssuesId
     * @returns {Promise<Array<any>>}
     */
    findChangeLogSprintOfIssues(aIssuesId:Array<any>) {
        checkNotNull("aIssuesId",aIssuesId);
        return database.query("select * from issuechangelog where issue_id in(?) and type = 'sprint' order by created", [aIssuesId]);
    }

    /**
     * Retorna los comentarios de un grupo de tareas
     * @param aIssuesId
     * @returns {Promise<Array<any>>}
     */
    findCommentsOfIssues(aIssuesId:Array<any>) {
        checkNotNull("aIssuesId",aIssuesId);
        return database.query("select * from issuecomments where issue_id in(?) order by created", [aIssuesId]);
    }

    /**
     * Retorna los sprints de un grupo de issuesIds
     * @param aIssuesId
     * @returns {Promise<Array<any>>}
     */
    findSprintsOfIssues(aIssuesId:Array<any>) {
        checkNotNull("aIssuesId",aIssuesId);
        return database.query("select * from issuesprint where issue_id in(?)", [aIssuesId]);
    }

    /**
     * Retorna los componentes de un grupo de issuedIds
     * @param aIssuesId
     * @returns {Promise<Array<any>>}
     */
    findComponentsOfIssues(aIssuesId:Array<any>) {
        checkNotNull("aIssuesId",aIssuesId);
        return database.query("select * from issuecomponent where issue_id in(?)", [aIssuesId]);
    }

    /**
     * Retorna las versiones de un grupo de issuedIds
     * @param aIssuesId
     * @returns {Promise<Array<any>>}
     */
    findVersionsOfIssues(aIssuesId:Array<any>) {
        checkNotNull("aIssuesId",aIssuesId);
        return database.query("select * from issueversion where issue_id in(?)", [aIssuesId]);
    }

    /**
     * Busca un proyecto por key
     * @param projectKey
     * @returns {Promise<any>}
     */
    findProjectByKey(projectKey:string) {
        checkNotNull("projectKey",projectKey);

        return database.queryForOne("Select * from project where projectkey = ?",[projectKey]);
    }

    /**
     * Busca un sprint por ID. Calcula por SQL el total de tareas, el total de puntos de historia, el total de tareas completadas
     * , el total de puntos de historia completados, las jornadas y las jornadas que quedan para acabar.
     * @param sprintId
     * @returns {Promise<any>}
     */
    findSprintById(sprintId:number) {

        checkNotNull("sprintId",sprintId);

        return database.queryForOne(
            "select *, " +
            "5 * (DATEDIFF(end_date, NOW()) DIV 7) + MID('0123444401233334012222340111123400012345001234550', 7 * NOW() + WEEKDAY(end_date) + 1, 1) as jornadas_pendientes,"+
            "5 * (DATEDIFF(end_date, start_date) DIV 7) + MID('0123444401233334012222340111123400012345001234550', 7 * WEEKDAY(start_date) + WEEKDAY(end_date) + 1, 1) as jornadas "+
            " from sprint " +
            "where id = ?",[sprintId,sprintId,sprintId,sprintId,sprintId]).then(sprint => {

            if(sprint && sprint.jornadas_pendientes < 0) {
                sprint.jornadas_pendientes = 0;
            }
            return sprint;
        });
    }

    /**
     * Retorna las tareas con el estado que tenían antes de una fecha determinada
     * @param fecha
     * @param aIssuesId
     * @returns {Promise<IQuery>}
     */
    findStatusOfIssuesInADate(fecha: Date,aIssuesId: Array<number>) {

        checkNotNull("fecha",fecha);
        checkNotNull("aIssuesId",aIssuesId);

        return database.query("select * " +
            "from issuestatus i " +
            "where i.issue_id in (?) " +
            "  and i.status_change_date <= ? " +
            "order by i.issue_id,i.status_change_date desc", [aIssuesId,fecha]);
    }

    /**
     * Retorna las tareas asociadads a un sprint. Si el sprint stá completo las tareas tendrán el estado que tenían en el
     * momento del cierre del sprint.
     * @param sprintId
     * @returns {Array<any>}
     */
    async findSnapShotIssuesFromSprint(sprintId: number) {

        checkNotNull("sprintId",sprintId);

        const sprint = await database.queryForOne("Select * from sprint where id = ?",[sprintId]);

        checkNotFound("sprint", sprint,sprintId);

        var issues = await database.query("Select * from issuedetail where sprint_id = ?", [sprintId]);

        if(sprint.complete_date != null) {

            //--- Agrupamos la lista de issues de estados cambiados por issue_id y a continuación extraemos de cada agrupación
            //    la primera fila de la lista, ya que al ordenarlo por fecha en orden descendente, ese es el último estado que
            //    la tarea tenía en esa fecha.
            //    Finalmente la recorremos y vamos actualizando la lista de issues del sprint con el estado que tenía en la fecha
            //    en que fue completado.

            var aIssuesId = issues.map(issue => issue.id);
            var issuesIdx = _.groupBy(issues,issue => issue.id);

            var issuestatuses = await this.findStatusOfIssuesInADate(sprint.complete_date, aIssuesId);

            issuestatuses = _.chain(issuestatuses).groupBy("issue_id").map((value:any[],key:string) => value[0]).value();

            var i = 0;

            issuestatuses.forEach((issuestatus:any) => {
                if(issuesIdx.hasOwnProperty(issuestatus.issue_id)) {
                    var issue:any = issuesIdx[issuestatus.issue_id][0];
                    issue.status_id =  issuestatus.status_change_id;
                    issue.status_name =  issuestatus.status_change_name;
                    issue.status_situacion= issuestatus.status_change_situacion;
                }
            });

        }

        return this.completeIssueInfo(issues);
    }

    /**
     * Busca las versiones y los componentes de las tareas que contiene el array de entrada y añade a cada issue un
     * campo 'components' y otro 'versions'
     * @param issues
     * @returns {Array<any>}
     */
    async completeIssueInfo(issues:Array<any>) {

        if(issues == null || issues.length == 0) return issues;

        const aIssuesId = issues.map(issue => issue.id);

        const data = await Promise.all([
            this.findComponentsOfIssues(aIssuesId),
            this.findVersionsOfIssues(aIssuesId),
            this.findSprintsOfIssues(aIssuesId),
            this.findChangeLogSprintOfIssues(aIssuesId),
            this.findChangeLogStatusOfIssues(aIssuesId),
            this.findCommentsOfIssues(aIssuesId)
        ]);

        var componentsIdx = _.groupBy(data[0],"issue_id");
        var versionsIdx = _.groupBy(data[1],"issue_id");
        var sprintsIdx = _.groupBy(data[2],"issue_id");

        const sprintChangeLog = [];

        data[3].forEach(cl => {
            const change:any = _.clone(cl);
            const oldSp = (cl.old_id || "").split(",");
            const newSp = (cl.new_id || "").split(",");

            delete change.id;
            delete change.new_id;
            delete change.new_name;
            delete change.old_id;
            delete change.old_name;

            if(cl.old_id == null) {
                change.action = "add";
                change.sprint_id = parseInt(_.last(newSp));
            }
            else if(cl.old_id.length < cl.new_id.length) {
                change.action = "add";
                change.sprint_id = parseInt(_.last(newSp));
            }
            else if(cl.old_id.length > cl.new_id.length) {
                change.action = "remove";
                change.sprint_id = parseInt(_.last(oldSp));
            }
            else if(cl.old_id.length == cl.new_id.length && cl.old_id != cl.new_id) {
                const newChange = _.clone(change);
                newChange.action = "remove";
                newChange.sprint_id = parseInt(_.last(oldSp));
                sprintChangeLog.push(newChange);
                change.action = "add";
                change.sprint_id = parseInt(_.last(newSp));
            }

            sprintChangeLog.push(change);

        });

        var sprintsChangeLogIdx = _.groupBy(sprintChangeLog,"issue_id");


        const statusChangeLog = [];

        data[4].forEach(s => {
            const change:any = _.clone(s);
            change.old_status_id = s.old_id;
            change.old_status_name = s.old_name;
            change.status_id = s.new_id;
            change.status_name = s.new_name;
            delete change.id;
            delete change.new_id;
            delete change.new_name;
            delete change.old_id;
            delete change.old_name;

            statusChangeLog.push(change);

        });

        var statusChangeLogIdx = _.groupBy(statusChangeLog,"issue_id");

        var commentsIdx = _.groupBy(data[5],"issue_id");

        issues.forEach((issue:any) => {
            issue.components = componentsIdx[issue.id]?componentsIdx[issue.id]:[];
            issue.versions = versionsIdx[issue.id]?versionsIdx[issue.id]:[];
            issue.sprints = sprintsIdx[issue.id]?sprintsIdx[issue.id]:[];
            issue.sprintsChangeLog = sprintsChangeLogIdx[issue.id]?sprintsChangeLogIdx[issue.id]:[];
            issue.statusChangeLog = statusChangeLogIdx[issue.id]?statusChangeLogIdx[issue.id]:[];
            issue.comments = commentsIdx[issue.id]?commentsIdx[issue.id]:[];
        });

        return issues;
    }

}

export const repository = new Repository();