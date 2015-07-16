'use strict';

import DataReferenceMain from './data_reference_main.react';
import DataReferenceTable from './data_reference_table.react';
import DataReferenceField from './data_reference_field.react';
import DataReferenceGraph from './data_reference_graph.react';
import Icon from './icon.react';
import inflection from 'inflection';

var cx = React.addons.classSet;

export default React.createClass({
    displayName: 'DataReference',
    propTypes: {
        Metabase: React.PropTypes.func.isRequired,
        query: React.PropTypes.object.isRequired,
        closeFn: React.PropTypes.func.isRequired,
        runQueryFn: React.PropTypes.func.isRequired,
        setQueryFn: React.PropTypes.func.isRequired,
        setDatabaseFn: React.PropTypes.func.isRequired,
        setSourceTableFn: React.PropTypes.func.isRequired,
        setDisplayFn: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            stack: [{ type: "graph", database: { id: 17 }}],
            tables: {},
            fields: {}
        };
    },

    close: function() {
        this.props.closeFn();
    },

    back: function() {
        this.setState({
            stack: this.state.stack.slice(0, -1)
        });
    },

    showField: function(field) {
        this.setState({
            stack: this.state.stack.concat({ type: "field", field: field })
        });
    },

    showTable: function(table) {
        this.setState({
            stack: this.state.stack.concat({ type: "table", table: table })
        });
    },

    showGraph: function(database) {
        this.setState({
            stack: this.state.stack.concat({ type: "graph", database: database })
        });
    },

    render: function() {
        var content;
        if (this.state.stack.length === 0) {
            content = <DataReferenceMain {...this.props} showTable={this.showTable} showGraph={this.showGraph} />
        } else {
            var page = this.state.stack[this.state.stack.length - 1];
            if (page.type === "table") {
                content = <DataReferenceTable {...this.props} table={page.table} showField={this.showField} />
            } else if (page.type === "field") {
                content = <DataReferenceField {...this.props} field={page.field}/>
            } else if (page.type === "graph") {
                content = <DataReferenceGraph {...this.props} database={page.database} showTable={this.showTable} showField={this.showField}/>
            }
        }

        var backButton;
        if (this.state.stack.length > 0) {
            backButton = (
                <a href="#" className="flex align-center mb2 text-default text-brand-hover no-decoration" onClick={this.back}>
                    <Icon name="chevronleft" width="18px" height="18px" />
                    <span className="text-uppercase">Back</span>
                </a>
            )
        }

        var closeButton = (
            <a href="#" className="flex-align-right text-default text-brand-hover no-decoration" onClick={this.close}>
                <Icon name="close" width="18px" height="18px" />
            </a>
        );

        return (
            <div className="DataReference-container p3 scroll-y full-height">
                <div className="DataReference-header flex mb1">
                    {backButton}
                    {closeButton}
                </div>
                <div className="DataReference-content">
                    {content}
                </div>
            </div>
        );
    }
});
