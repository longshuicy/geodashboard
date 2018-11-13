import React, {Component} from "react";
import TrendsGraph from '../components/TrendsGraph';
import Spinner from './Spinner';
import YearSlider from './YearSlider';

class TrendDetailRight extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedStartYear: 0,
            selectedEndYear: 0,
            loading: false,
            data: {}
        };
        this.onSliderChange = this.onSliderChange.bind(this);
    }

    loadDetailData() {
        this.props.fetchRegionDetailTrends(this.props.trends_parameter, this.props.trends_season, this.props.trends_region_id);
        const that = this;
        const promise = new Promise((resolve) => {
            setInterval(() => {
                let trend = that.props.trends_regions.find(function(element) {
                    return element !== undefined && element.name === that.props.trends_region_id;
                });
                if( trend !== undefined && Object.keys(trend.trends_detail).length > 2) {
                    resolve(trend.trends_detail);
                }
                let show_spinner = that.props.show_spinner;
                if(!show_spinner) {
                    resolve([]);
                }

            }, 3000);
        });
        return promise;
    }

    componentWillMount() {
        this.setState({loading: true});
        this.loadDetailData().then((data) => {
            this.setState({
                loading: false,
                data: data
            });
        });
    }

    onSliderChange(value) {
        this.setState({selectedStartYear: value[0], selectedEndYear: value[1]})
    }

    render() {

        if(this.state.loading) {
            return (
                <Spinner/>
            )
        }
        let years = [];
        this.state.data.map( k => {
            Object.keys(k).map( l => years.push(parseInt(l)));
        });
        const parameter = this.props.parameters.find(x => x.name === this.props.trends_parameter);
        const minYear = Math.min.apply(null, years);
        const maxYear = Math.max.apply(null, years);
        const start_year = this.state.selectedStartYear === 0 ? minYear: this.state.selectedStartYear;
        const end_year = this.state.selectedEndYear === 0 ? maxYear : this.state.selectedEndYear;
        let contents = <div></div>;
        if(parameter) {

            contents =
                <div>
                    <YearSlider start_year={minYear} end_year={maxYear}
                                selectedStartYear = {start_year}
                                selectedEndYear = {end_year}
                                onSliderChange = {this.onSliderChange}/>
                <TrendsGraph
                trends_settings={this.props.trends_settings}
                trends_region_id={this.props.trends_region_id}
                trends_parameter={this.props.trends_parameter}
                title={parameter.title}
                units={parameter.unit}
                trends_season={this.props.trends_season}
                start_year={start_year}
                end_year={end_year}
                trends_regions={this.props.trends_regions}
            />
                </div>
        }
        return (
            <div>
                {contents}
            </div>

        );
    }

}

export default TrendDetailRight;
