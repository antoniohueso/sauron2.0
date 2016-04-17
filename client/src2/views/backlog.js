import React from "react";
import "whatwg-fetch";
import { Row } from "../core/elements";
import {observer} from "mobx-react";
import {appStore} from "./../store/appstore";

@observer
export class BacklogView extends React.Component {

    componentDidMount() {
        appStore.selectedMenuOption = appStore.menuOptions.BACKLOG;
    }

    render() {
        return(
            <Row>
                <h1>Backlog!</h1>
            </Row>
        );
    }
}