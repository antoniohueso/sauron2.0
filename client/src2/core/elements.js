import React from "react";
import classNames from "classnames";
import _ from "lodash";
import { Link } from 'react-router';

export class MainContainer extends React.Component {

    static propTypes = {
        fluid: React.PropTypes.any
    }

    render() {
        return(
            <div className={classNames({"container-fluid":this.props.fluid?true:false,"container":this.props.fluid?false:true}
                ,'MainContainer',this.props.className)}>
                {this.props.children}
            </div>
        );
    }
}

export class Row extends React.Component {

    static propTypes = {
        size: React.PropTypes.array
    }

    render() {

        const size = this.props.size || [];

        for(let i = size.length; i < React.Children.count(this.props.children); i++ ) {
            size.push(12);
        }

        return(
            <div className={classNames("row","Row",this.props.className)}>
                {React.Children.map(this.props.children,(child,index) => {
                    return (
                        <div key={index} className={'col-md-'+size[index]}>
                            {child}
                        </div>
                    );
                })}
            </div>
        );
    }
}

export class DataTable extends React.Component {

    static propTypes = {
        bordered: React.PropTypes.any,
        colDef: React.PropTypes.array.isRequired,
        data: React.PropTypes.object.isRequired,
        idProperty: React.PropTypes.string
    }

    render() {

        const colDef = this.props.colDef || [];
        const data = this.props.data || [];

        return(
            <table className={classNames("table",{"table-bordered":this.props.bordered?true:false},"DataTable",this.props.className)}>
            <thead>
            <tr>
            {colDef.map(col => {
                return (
                    <th key={col.property} width={col.size}>
                        {_.isFunction(col.header)?col.header(col):col.header}
                    </th>
                );
            })}
            </tr>
            </thead>
            <tbody>
            {data.map((row,index) => {
                return (
                    <tr key={this.props.idProperty?row[this.props.idProperty]:index}>
                        {colDef.map(col => {
                            return (
                                <td key={col.property} width={col.size}>
                                    {col.format?col.format(col.property,row,col):row[col.property]}
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
            </tbody>
            </table>
        );
    }

}


export class MenuBar extends React.Component {

    static propTypes = {
        fixed: React.PropTypes.any,
        title: React.PropTypes.string.isRequired,
        options: React.PropTypes.array.isRequired,
        defaultOption: React.PropTypes.string.isRequired
    }


    render() {

        const options = this.props.options || [];

        return(

            <div className={classNames("navbar", "navbar-default" , {"navbar-fixed-top":this.props.fixed?true:false},"MenuBar")} role="navigation">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed"
                                data-toggle="collapse" data-target=".navbar-collapse">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="/"><span>{this.props.title}</span></a>
                    </div>
                    <div className="collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                            {options.map(option => {
                                return (
                                    <li key={option.id} className={classNames({"active":this.props.defaultOption == option.id})}>
                                        <Link to={option.href}>
                                            <span><i className={classNames("glyphicon",option.icon)}> </i> {option.title}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>


        );
    }
}




