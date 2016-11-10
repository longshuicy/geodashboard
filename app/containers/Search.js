import { connect } from 'react-redux'
import SearchComponent from '../components/Search'

const mapStateToProps = (state, ownProps) => {
    return {
        sensorsData: state.sensors.data,
        parameters: state.sensors.parameters,
        sources: state.sensors.sources,
    }
};

const Search = connect(mapStateToProps)(SearchComponent);

export default Search