import React from "react";
import "whatwg-fetch";
import { Row, SectionTable } from "../core/elements";
import { observer } from "mobx-react";
import { appStore } from "../store/appstore";
import { SprintStore } from "../store/sprintstore";
import moment from "moment";

@observer
export class SprintView extends React.Component {

    store = new SprintStore();

    componentDidMount() {
        appStore.selectedMenuOption = appStore.menuOptions.SPRINT;

        this.store.findSprint("SC", 36);
    }


    render() {

        if(!this.store.sprint) return false;

        return(
            <Row>
                <SectionTable data={this.store.sprint}
                              colDef={[
                                { type:"section", header:"Datos identificativos", size:2, icon:"glyphicon-bookmark", className:"text-info" },
                                { header:"Proyecto", property:"project.name" },
                                { header:"Sprint ID", property:"id" },
                                { header:"Proyecto", property:"project.name" },
                                { type:"section", header:"Duración", size:2, icon:"glyphicon glyphicon-calendar", className:"text-info" },
                                { header:"Duración", property:"jornadas", format: (prop,data,colDef) => <span>{data.jornadas} <span>días.</span></span> } ,
                                { header:"Comienza", property:"start_date", format: (prop,data,colDef) => <span>{moment(data.start_date).format('dddd[,] DD [de] MMMM [de] YYYY')}</span> },
                                { header:"Finaliza", property:"end_date", format: (prop,data,colDef) => <span>{moment(data.end_date).format('dddd[,] DD [de] MMMM [de] YYYY')}</span> }
                              ]}/>
            </Row>
        );
    }
}
