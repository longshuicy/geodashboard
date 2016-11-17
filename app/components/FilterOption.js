import React, {Component} from 'react'
import styles from '../styles/filterOption.css'

class FilterOption extends Component {
	constructor(props) {
	    super(props);

	    this.state = {
	      dimension: ""
	    };
	    this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event) {
		const selectedParameters = Object.assign([], this.props.selectedParameters);
		const selectedDataSources = Object.assign([], this.props.selectedDataSources);
	    this.props.onOptionChange(event, selectedParameters, selectedDataSources);
  	}

	render() {
		var checkedVar = (this.props.name == "data_source" && this.props.selectedDataSources.indexOf(this.props.id) > -1) || 
						(this.props.name == "parameters" && this.props.selectedParameters.indexOf(this.props.id) > -1)
		return (
			<div className={styles.row}>
				<div className={styles.col1}>
					<input type="checkbox" name={this.props.name} value={this.props.id} onChange={this.handleChange} checked={checkedVar}></input>
				</div>
				<div className={styles.col2}>{this.props.label}</div>
			</div>
		);
	}
}

export default FilterOption