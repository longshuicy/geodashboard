import React, {Component} from 'react'
import SourceFilterList from './SourceFilterList'
import ParamsFilterList from './ParamsFilterList'
import LocationsFilterList from './LocationsFilterList'
import TimeFilterList from './TimeFilterList'
import FilterList from './FilterList'
import { connect } from 'react-redux'
import styles from '../styles/filterSelection.css'
import { addSearchParameter, addSearchDataSource } from '../actions'

class FilterSelection extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedValues: ['locations'],
			showAddButton: true
		}
	    this.handleClickAddFilter = this.handleClickAddFilter.bind(this)
	    this.handleChange = this.handleChange.bind(this)
	}

	handleClickAddFilter(event) {
		var notUsedFilters = []
		this.props.filters.map((f, key) => {
		 	if(!this.state.selectedValues.includes(f.id)) {
		 		notUsedFilters.push(f.id)
				
			}
		})
		if(notUsedFilters.length > 0) {
			var selectedVal = this.state.selectedValues.slice()
			selectedVal.push(notUsedFilters[0]);
			this.setState({selectedValues: selectedVal, showAddButton: true});
		} 
		if(notUsedFilters.length <=1) {
			this.setState({showAddButton: false});
		}

	}

	handleChange(event) {
	    var value = event.target.value;
	    var idx = event.target.dataset.idx;
	    console.log(value, " was selected");
	    if(value=="parameters" || this.state.selectedValues[idx] == "parameters"){
	    	this.props.onClearFilter(true, false);
	    }
	    if(value == "data_source" || this.state.selectedValues[idx] == "data_source") {
			this.props.onClearFilter(false, true);
	    }
	    var newSelected = Object.assign([], this.state.selectedValues);
	    newSelected = newSelected.splice(0, idx);
	    newSelected.push(value);
	    var showAdd = newSelected.length < this.props.filters.length;
	    
	    this.setState({selectedValues: newSelected, showAddButton: showAdd });
	    
  	}


	render() {
		
		const filters = this.props.filters.map((f, key) => {
			console.log(f.id)
			if(this.state.selectedValues.includes(f.id)) {
				return <FilterList key={key} onChangeSelection={this.handleChange} selectedValues={this.state.selectedValues} idx={this.state.selectedValues.indexOf(f.id)} attribute={f.id}/>
			}
		})
		var addButton;
		if(this.state.showAddButton) {
			addButton = <button id="addButton" className={styles.add} onClick={this.handleClickAddFilter}>+</button>
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

const mapStateToProps = (state, ownProps) => {
  return {
  	filters: state.searchFilters.filters,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onClearFilter: (clearSelectedParameters, clearSelectedDataSources) => {
			if(clearSelectedParameters) {
				const selectedParameters = [];
				dispatch(addSearchParameter(selectedParameters));
			} 
			if(clearSelectedDataSources) {
				const selectedDataSources = [];
				dispatch(addSearchDataSource(selectedDataSources));
			}
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterSelection)