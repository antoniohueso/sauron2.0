import React from "react";
import "whatwg-fetch";
import "./../core/elements";
import {observer} from "mobx-react";
import {appStore} from "./../store/appstore";

@observer
export class SprintView extends React.Component {

    render() {
        return(
            <Row>
                <h1>Sprint!</h1>
            </Row>
        );
    }
}

@observer
export class IssueView extends React.Component {

    store = new IssuesStore();

    componentDidMount() {
        this.store.search(34);

        setTimeout(() => {
            this.store.search(37);
        },5000)
    }


    render() {
        return (
            <DataTable idProperty="issuekey"
                       colDef={[
                        { header:"Id", size:"20%", property:"issuekey",format:(prop,row,col) => <IssueKeyCol prop={prop} value={row[prop]} />},
                        { header:(col) => <h1>Summary</h1>, size:"60%", property:"summary"},
                        { header:"Estado", size:"20%", property:"status_name"}
                   ]}
                       data={this.store.data} />
        );
    }
}

export class IssueKeyCol extends React.Component {
    render() {
        return <span className="text-success">{this.props.prop} {this.props.value}</span>;
    }
}

export class IssuesStore {
    @observable data = [];

    search(id) {
        fetch(`/rest/sprint/${id}/issues`).then(r => r.json()).then(r => this.data = r);
    }
}

export class OtroStore {
    @observable title = "Caca";
    @observable title2 = "Caca";
}

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={Main}>
            <Route path="sprint" component={About}/>
            <Route path="users" component={Users}>
                <Route path="/user/:userId" component={User}/>
            </Route>
            <Route path="*" component={NoMatch}/>
        </Route>
    </Router>,
    document.getElementById("app")
);