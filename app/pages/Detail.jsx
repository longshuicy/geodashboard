import React, {Component} from 'react';
import {connect} from "react-redux";
import {Link} from 'react-router';
import Menu from '../containers/MenuBar';
import DetailTabs from '../components/DetailTabs';
import DetailContents from '../containers/DetailContents';
import {getMobileSizeMax, getSourceName, getMobileExplorePath} from "../utils/getConfig";
import { resetDetailPage } from '../actions';
import type { Dispatch } from '../utils/flowtype'
import styles from '../styles/main.css';
import {Icon} from 'react-mdc-web'

class Detail extends Component {

    constructor(props: Object) {
        super(props);
        this.state = {
            category_mappings: {},
            sensor: []
        };
        this.setUpCategoryMappings = this.setUpCategoryMappings.bind(this);
    }

    componentWillMount() {
        this.setUpCategoryMappings(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.setUpCategoryMappings(newProps);
    }

    componentWillUnmount() {
        this.props.cleanPreviousSelection();
    }

    setUpCategoryMappings(newProps) {

        const sensor = newProps.sensors.find(x => x.name === newProps.params.name);
        if(sensor) {
            const {parameters, categories, mappings} = newProps.parameters;
            let categories_mapping = {};
            sensor.parameters.map(parameter_name => {
                const parameter = parameters.find(parameter => parameter.name === parameter_name);
                if(parameter) {
                    const mapped_categories = mappings.filter(mapping => mapping.parameter_id === parameter.id);
                    mapped_categories.map(mapping => {
                        const category = categories.find(c => c.id === mapping.category_id);
                        if(Object.keys(categories_mapping).indexOf(category.name) === -1) {
                            categories_mapping[category.name] = {"type": category.detail_type, "parameters": [parameter]}
                        } else {
                            categories_mapping[category.name]["parameters"].push(parameter)
                        }
                    })
                }
            });

            this.setState({category_mappings: categories_mapping, sensor: sensor});
        }
    }

    render() {

        if(Object.keys(this.state.category_mappings).length === 0 ) {
            return (
                <div>
                    <Menu selected='explore'/>
                    <h1> {this.props.selected_detail}</h1>
                    <div className={styles.make_modal}>
                        <div className={styles.loading_spinner}></div>
                    </div>
                </div>
            )
        }

        let display_tabs = '';
        const category_mappings = this.state.category_mappings;
        let selected_category = Object.keys(category_mappings).indexOf(this.props.params.category) > 0 ? this.props.params.category :
            Object.keys(category_mappings)[0];
        // TODO: Show a loading screen while getting the sensor/ if categories_mapping is empty
        if (screen.width > getMobileSizeMax()) {
            display_tabs = <DetailTabs sensorName={this.props.params.name} categories={this.state.category_mappings}
                                       selected = {selected_category}/>
        }

        let title = "";

        if(this.state.sensor) {
            const sensor = this.state.sensor;
            const source_name = getSourceName(sensor.properties.type);
            if(screen.width <= getMobileSizeMax()){
                title = (<h1><Link
                    href={getMobileExplorePath()}>Explore Mobile</Link><Icon name="chevron_right"/> {sensor.name}
                </h1>);
            } else {
                title = (<h1 className={styles.detail_title}>
                    <Link  href={"/#explore/all"}> <Icon name="chevron_left"/></Link>
                    {source_name} <Icon name="chevron_right"/> {sensor.properties.popupContent}</h1>);
            }


        }
        let page_content = (
            <div>
                <Menu selected='explore'/>
                {title}
                {display_tabs}
                <div className={styles.content}>
                    <DetailContents sensor={this.state.sensor}
                                    category_parameters={this.state.category_mappings[selected_category]["parameters"]}
                                    chart_type = {this.state.category_mappings[selected_category]["type"]}/>
                </div>
            </div>
        );

        return (page_content);

    }
}

const mapStateToProps = (state) => {
    return {
        sensors: state.sensors.data,
        parameters: state.parameters,
        selected_detail: state.sensorDetail.name
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
      cleanPreviousSelection:() => {
          dispatch(resetDetailPage());
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
