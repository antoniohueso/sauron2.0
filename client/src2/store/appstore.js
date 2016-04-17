import {observable} from "mobx";

class AppStore {

    title = "Sauron";

    menuOptions = {
        SEGUIMIENTO:"seguimiento",
        BACKLOG:"backlog",
        SPRINT:"sprint",
        HISTORICO:"historico"
    }

    mainMenu = [
        { id:"seguimiento", title:"Seguimiento", icon:"glyphicon-eye-open", href:"/seguimiento"},
        { id:"sprint", title:"Sprint", icon:"glyphicon-eye-calendar", href:"/sprint"},
        { id:"backlog", title:'Backlog', icon:"glyphicon-list-alt", href:"/backlog"},
        { id:"historico", title:'Historico', icon:"glyphicon-folder-close", href:"/historico"}
    ];

    @observable selectedMenuOption;

    constructor() {
        this.selectedMenuOption = this.menuOptions.SEGUIMIENTO;
    }

}

export const appStore:AppStore = new AppStore();