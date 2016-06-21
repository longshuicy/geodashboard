import React, {Component} from 'react'
import styles from './styles/filterList.css';
import FilterOption from './FilterOption';
import dimensions from '../data/dimensions.json'
import { connect } from 'react-redux'

class SourceFilterList extends Component {
	constructor(props) {
		super(props)
	   	this.state = {
	   		selectValue: 'data_source'
	    }
	}

	handleChange(event) {
	    var value = event.target.value
	    console.log(value, " was selected")
	    this.setState({selectValue: event.target.value})
  	}

	render() {
		return (
			<div className={styles.root}>
				<select value={this.state.selectValue} onChange={this.handleChange} className={styles.select}>
				  {dimensions.map(d =>
				  	<option value={d.id} key={d.id}>{d.name}</option>
				  )}
				</select>
				<div>
					{this.props.sources.map(p =>
						<FilterOption id={p.id} label={p.label} key={p.id}/>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
  return {
    sources: state.sensors.sources,
  }
}

export default connect(mapStateToProps)(SourceFilterList)