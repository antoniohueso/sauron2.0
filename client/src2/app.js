import ReactDOM from "react-dom";
import React from "react";
import "whatwg-fetch";
import { MainContainer, Row, DataTable, MenuBar } from "./core/elements";
import { observer } from "mobx-react";
import { appStore } from "./store/appstore";
import { Router, Route, hashHistory, browserHistory, IndexRoute } from 'react-router';
import { SprintView } from "./views/sprint";
import { BacklogView } from "./views/backlog";
import { HistoricoView } from "./views/historico";
import { SeguimientoView } from "./views/seguimiento";
import "/jspm_packages/npm/moment@2.12.0/locale/es";


@observer
export class Main extends React.Component {

    render() {
        return(

            <div>
                <MenuBar fixed
                         title={appStore.title}
                         defaultOption={appStore.selectedMenuOption}
                         options={appStore.mainMenu} />

                <MainContainer>
                    {this.props.children}
                </MainContainer>
           </div>
        );
    }
}

export class NotFoundView extends React.Component {

    render() {
        return(
            <Row>
                <h1>La página solicitada no existe</h1>
            </Row>
        );
    }
}


ReactDOM.render(

    <Router history={browserHistory}>
        <Route path="/" component={Main}>
            <IndexRoute component={SprintView}/>
            <Route path="seguimiento" component={SeguimientoView} />
            <Route path="sprint" component={SprintView} />
            <Route path="backlog" component={BacklogView} />
            <Route path="historico" component={HistoricoView} />
            <Route path="*" component={NotFoundView}/>
        </Route>
    </Router>,

    document.getElementById("app")
);