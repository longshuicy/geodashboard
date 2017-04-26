import React, {Component} from 'react'
import FilterList from '../containers/FilterList'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import styles from '../styles/filterSelection.css'

class FilterSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: 0
        };
    }

    handleClickAddFilter() {
        let notUsedFilters = [];
        this.props.filters.map((f, key) => {
            if (!this.props.selectedFilters.includes(f.id)) {
                notUsedFilters.push(f.id)
            }
        });
        if (notUsedFilters.length > 0) {
            this.props.onAddFilter(notUsedFilters[0]);

            this.setState({selectedValue: this.props.selectedFilters.length });
        }

    }

    handleChange(event, valueIdx, value) {
        var idx = event.target.parentElement.parentElement.parentElement.dataset.idx; //Idx of the selected filter
        console.log(value, " was selected");
        if (value == "parameters" || this.props.selectedFilters[idx] == "parameters") {
            this.props.onClearFilter(true, false);
        }
        if (value == "data_source" || this.props.selectedFilters[idx] == "data_source") {
            this.props.onClearFilter(false, true);
        }
        if (value == "time" || this.props.selectedFilters[idx] == "time") {
            this.props.onClearTime();
        }
        if (value == "locations" || this.props.selectedFilters[idx] == "locations") {
            this.props.onClearLocation();
        }
        var newSelected = Object.assign([], this.props.selectedFilters);
        newSelected = newSelected.splice(0, idx);
        newSelected.push(value);
        this.props.onChangeFilter(newSelected, idx);
    }

    handleClickRemoveFilter(event) {
        var idx = event.target.parentElement.dataset.idx;
        var value = this.props.selectedFilters[idx];

        console.log(value, " was removed");
        if (value == "parameters" || this.props.selectedFilters[idx] == "parameters") {
            this.props.onClearFilter(true, false);
        }
        if (value == "data_source" || this.props.selectedFilters[idx] == "data_source") {
            this.props.onClearFilter(false, true);
        }
        if (value == "time" || this.props.selectedFilters[idx] == "time") {
            this.props.onClearTime();
        }
        if (value == "locations" || this.props.selectedFilters[idx] == "locations") {
            this.props.onClearLocation();
        }
        var newSelected = Object.assign([], this.props.selectedFilters);
        newSelected.splice(idx, 1);
        this.props.onDeleteFilter(idx);

        this.setState({ selectedValue: (idx > 0 ? idx - 1 : 0)});

    }

    componentWillMount() {
        if (this.props.selectedFilters.length < 1) {
            this.props.onAddFilter("locations");
        }
    }

    componentDidUpdate() {
        // when the filter list is changing, the filters after will be removed, then update selectedValue.
        if(this.state.selectedValue >= this.props.selectedFilters.length) {
            this.setState({selectedValue: this.props.selectedFilters.length - 1});
        }
    }

    handleExpand(event){
        // leave this line for debugging
        //console.log(event.target.parentElement.parentElement);

        if(!isNaN(parseInt(event.target.parentElement.parentElement.id))) {
            this.setState({selectedValue: parseInt(event.target.parentElement.parentElement.id)});
        } else if(!isNaN(parseInt(event.target.parentElement.parentElement.parentElement.id))) {
            this.setState({selectedValue: parseInt(event.target.parentElement.parentElement.parentElement.id)});
        } else {
            this.setState({selectedValue: parseInt(event.target.parentElement.parentElement.parentElement.parentElement.id)});
        }
    };

    render() {
        const filterIds = this.props.filters.map(f => f.id);
        const filters = this.props.selectedFilters.map((selected) => {
            let idx = filterIds.indexOf(selected);
            let f = this.props.filters[idx];

            return <FilterList key={idx} selectedId={this.state.selectedValue} onChangeSelection={this.handleChange.bind(this)}
                               selectedValues={this.props.selectedFilters} idx={this.props.selectedFilters.indexOf(f.id)}
                               attribute={f.id} onClickRemove={this.handleClickRemoveFilter.bind(this)}
                               onExpand={this.handleExpand.bind(this)} />
        });
        let addButton;
        if (this.props.selectedFilters.length < this.props.filters.length) {
            addButton = <FloatingActionButton id="addButton" onClick={this.handleClickAddFilter.bind(this)}
                                              className={styles.add}><ContentAdd/></FloatingActionButton>
        }
        return (
            <div>
                <div id="filters-div">
                    {filters}
                    {addButton}
                </div>
            </div>
        );
    }
}

export default FilterSelection