import React from "react";
import "whatwg-fetch";
import { Row } from "../core/elements";
import {observer} from "mobx-react";
import {appStore} from "./../store/appstore";

@observer
export class SeguimientoView extends React.Component {

    componentDidMount() {
        appStore.selectedMenuOption = appStore.menuOptions.SEGUIMIENTO;
    }


    render() {
        return(
            <Row>
                <h1>SeguimientoView!</h1>
            </Row>
        );
    }
}