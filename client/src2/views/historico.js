import React from "react";
import "whatwg-fetch";
import { Row } from "../core/elements";
import {observer} from "mobx-react";
import {appStore} from "./../store/appstore";

@observer
export class HistoricoView extends React.Component {

    componentDidMount() {
        appStore.selectedMenuOption = appStore.menuOptions.HISTORICO;
    }


    render() {
        return(
            <Row>
                <h1>Histórico!</h1>
            </Row>
        );
    }
}