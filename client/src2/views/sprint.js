import React from "react";
import "whatwg-fetch";
import { Row } from "../core/elements";
import { observer } from "mobx-react";
import { appStore } from "../store/appstore";
import { SprintStore } from "../store/sprintstore";

@observer
export class SprintView extends React.Component {

    store = new SprintStore();

    componentDidMount() {
        appStore.selectedMenuOption = appStore.menuOptions.SPRINT;

        this.store.findSprint("SC", 36);
    }


    render() {
        return(
            <Row>
                <h1>Sprint!</h1>
            </Row>
        );
    }
}

