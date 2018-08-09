import React, {Component} from 'react';
import styles from '../styles/main.css';
import exploreStyles from '../styles/explore.css';
import {
    Button, Card, CardTitle, CardSubtitle, CardHeader, CardText,
    Icon, List, ListHeader, ListGroup
} from 'react-mdc-web';
import ExploreAccordionSections from '../containers/ExploreAccordionSections';
import {sortSitesNumerically} from '../utils/arrayUtils';


class ExploreCustomItemsTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accordion_icon: false,
        };
        (this:any).clickedItemsAccordion = this.clickedItemsAccordion.bind(this);
    }

    clickedItemsAccordion() {
        this.setState({accordion_icon: !this.state.accordion_icon});
    }

    render() {

        let item_card = [];
        let list_cards = [];

        this.props.item.sections.map(item_section => {

            let contents = [];

            this.props.sources.map(source => {

                let key_val = source.id;
                let tooltip_val = source.label;
                let section_label = source.id.toUpperCase();

                let source_data = this.props.data.filter(data =>
                    data.properties.huc !== undefined &&
                    data.properties.type.id === source.id &&
                    item_section.value.includes(data.properties.huc[item_section.property].code));

                // If the Name is a Number, then sort numerically instead of alphabetically
                source_data = sortSitesNumerically(source_data);

                let section_data = (
                    <ExploreAccordionSections
                        sourceData={source_data} tooltipVal={tooltip_val}
                        id={key_val} key={key_val} sectionLabel={section_label}
                    />
                );

                if (section_data.props.sourceData.length > 0) {
                    contents.push(section_data);
                }

            });

            if (contents.length > 0) {
                item_card.push(
                    <List className={this.state.accordion_icon ?
                        exploreStyles.listItemsStyleOpen : exploreStyles.listItemsStyleClosed}
                    >
                        <Card id={item_section.title} className={exploreStyles.exploreCard} key={item_section.title}>
                            <CardHeader>
                                <CardTitle className={styles.title_card}>
                                    {item_section.title}: {item_section.value.toString().replace(/,/g, ', ')}
                                </CardTitle>
                            </CardHeader>
                            <CardText>
                                <div key={this.id}>
                                    {contents}
                                </div>
                            </CardText>
                        </Card>
                    </List>
                );
            }

        });

        let return_list = '';

        if (item_card.length > 0) {

            list_cards.push(item_card);

            return_list = (
                <ListGroup>
                    <ListHeader className={exploreStyles.listHeaderStyle}
                                onClick={() => {this.clickedItemsAccordion()}}
                    >
                        {this.props.item.title}
                        <Icon className={"material-icons " + exploreStyles.accordionIcon}
                              name={this.state.accordion_icon ? 'expand_less' : 'expand_more'}
                        />
                    </ListHeader>
                    {list_cards}
                </ListGroup>
            );

        }

        return(<div>{return_list}</div>)

    }
}

export default ExploreCustomItemsTab;
