import React, {Component} from 'react'
import Menu from '../containers/MenuBar'
import Map from '../containers/Map'
import ExploreSourcesTab from '../containers/ExploreSourcesTab'
import {Card, CardTitle, CardHeader, CardText, Grid, Cell, Content, List} from 'react-mdc-web'
import styles from '../styles/main.css'
import {connect} from 'react-redux'

class Explore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    render() {

        let sourceLists = this.props.sources.map(s =>
            <Card id={s} className={styles.card}>
                <CardHeader>
                    <CardTitle>{s.label} </CardTitle>
                </CardHeader>
                <CardText>
                    <ExploreSourcesTab source={s}/>
                </CardText>
            </Card>
        )

        return (
            <div>
                <MenuPage selected='explore'/>
                <Content>
                    <div className={styles.body}>
                        <Grid className={styles.noPadding}>
                            <Cell col={2}>
                                <List className={styles.leftcolumn}>
                                    {sourceLists}
                                </List>
                            </Cell>
                            <Cell col={10}>
                                <div className={styles.rightmap}>
                                    <Map display_draw='False'/>
                                </div>
                            </Cell>
                        </Grid>
                    </div>
                </Content>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        sources: state.sensors.sources
    }
};

export default connect(mapStateToProps)(Explore)