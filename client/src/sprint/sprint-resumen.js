import {bindable} from 'aurelia-framework';
import {sprintData} from '../data/SprintData';

export class SprintResumen {

    @bindable projectKey;

    @bindable sprintId;

    sprint = null;

    attached() {
        sprintData(this.projectKey,this.sprintId).then(sprint => {
            this.sprint = sprint;
        });
    }





}
