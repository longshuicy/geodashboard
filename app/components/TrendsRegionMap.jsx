/*
 * @flow
 */

import React, {Component} from 'react';
let ol = require('openlayers');
require("openlayers/css/ol.css");
import styles from '../styles/map.css';
import {Icon} from 'react-mdc-web';
import {getTrendColor, getCustomLocation} from '../utils/getConfig';
import {popupHeader, popupTrends} from '../utils/mapPopup';
import {sensorsToFeaturesTrendPage, getAttribution} from '../utils/mapUtils';
import {drawHelper, centerHelper} from '../utils/mapDraw';
import type {MapProps, TrendsMapState} from '../utils/flowtype';


class TrendsRegionMap extends Component {
    state: TrendsMapState;

    constructor(props: MapProps) {
        super(props);
        this.state = {
            center: [-84.44799549, 38.9203417],
            vectorSource: new ol.source.Vector,
            clusterSource: new ol.source.Cluster({distance: 1, source: new ol.source.Vector}),
            areaPolygonSource: new ol.source.Vector,
            currentZoom: 5.5,
            maxZoom: 12,
            // create a fake map to avoid checking map.isdefined every time for flow.
            map: new ol.Map({
                view: new ol.View({
                    center: [0, 0],
                    zoom: 1
                }),
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                target: 'map'
            })
        }
    }

    render() {

        return (
            <div>
                <div id='map' className={styles.root}></div>
                <div id="trends_legend" className={styles.trends_legend}></div>
                <div id="search" style={{position: 'absolute', bottom: '10px', left: '25em', padding: '5px'}}>
                    <button id="centerButton"><Icon name="gps_fixed"/></button>
                </div>
                <div style={{display: "none"}}>
                    <div id="marker" title="Marker" className="marker"></div>
                    <div id="popup" className={styles.olPopup}>
                        <a href="#" id="popup-closer" className={styles.olPopupCloser}></a>
                        <div id="popup-content"></div>
                    </div>
                </div>
            </div>
        );

    }

    popupHandler(feature: ol.Feature, coordinate: number[]) {
        const content = document.getElementById('popup-content');
        if (feature && feature.getId()) {

            let popupText = popupHeader(feature, styles) + popupTrends(feature, styles);

            if (content) {
                content.innerHTML = popupText;
            }
            let overlay = this.state.map.getOverlayById("marker");
            overlay.setPosition(coordinate);
        }
    }

    componentDidUpdate() {
        let features;

        let copyOfMap = this.state.map;

        let that = this;

        drawHelper(copyOfMap, true, that);

        let map_items;
        let area;
        let threshold = this.props.threshold_value;
        let feature = new ol.Feature();
        let region_features = [];

        map_items = this.props.trendRegions;

        // This is for the Region Outlines for all Regions at once
        let trendsPageRegions = this.props.trendAllRegions;

        for (let i = 0; i < trendsPageRegions.length; i++) {
            if (trendsPageRegions[i] != 'ALL') {
                area = getCustomLocation(trendsPageRegions[i].toLowerCase());
                if (area && area.geometry) {
                    feature = new ol.Feature({geometry: new ol.geom.Polygon(area.geometry.coordinates)});
                    region_features.push(feature);
                }
            }
        }

        this.state.areaPolygonSource.clear();
        this.state.areaPolygonSource.addFeatures(region_features);

        features = sensorsToFeaturesTrendPage(
            map_items, this.props.selectedParameter, threshold);

        this.state.vectorSource.clear();
        this.state.vectorSource.addFeatures(features);

        if (area) {
            this.state.map.getView().fit(
                this.state.areaPolygonSource.getExtent(), this.state.map.getSize());
        } else {
            this.state.map.getView().fit(
                this.state.vectorSource.getExtent(), this.state.map.getSize());
        }

    }

    componentDidMount() {

        let threshold = this.props.threshold_value;

        let map_items = this.props.trendRegions;

        let trends_parameter_lake_regions = [];
        let trends_settings = this.props.trends_settings;
        trends_settings.map(p => {
            if (p.parameter.lake_regions == true) {
                trends_parameter_lake_regions.push(p.parameter.id);
            }
        });

        let features = sensorsToFeaturesTrendPage(
            map_items, this.props.selectedParameter, trends_parameter_lake_regions);

        let vectorSource = new ol.source.Vector({
            features: features
        });

        const clusterSource = new ol.source.Cluster({
            distance: 1,
            source: this.state.vectorSource
        });
        this.setState({clusterSource: clusterSource});

        let clusters = new ol.layer.Vector({
            source: clusterSource,
            style: function (feature) {
                let size = feature.get('features').length;
                let style;

                const trend_type = feature.getProperties().features[0].attributes.trend_type;
                if (trend_type == "trendUp") {
                    style = (new ol.style.Style({
                        image: new ol.style.RegularShape({
                            points: 3,
                            radius: 10,
                            fill: new ol.style.Fill({color: getTrendColor(trend_type)}),
                            stroke: new ol.style.Stroke({color: '#000000', width: 1})
                        })
                    }));
                } else if (trend_type == "trendDown") {
                    style = (new ol.style.Style({
                        image: new ol.style.RegularShape({
                            points: 3,
                            radius: 10,
                            rotation: 3.141592654,
                            fill: new ol.style.Fill({color: getTrendColor(trend_type)}),
                            stroke: new ol.style.Stroke({color: '#000000', width: 1})
                        })
                    }));
                } else if (trend_type == "overThresholdUp") {
                    style = (new ol.style.Style({
                        image: new ol.style.RegularShape({
                            points: 3,
                            radius: 10,
                            fill: new ol.style.Fill({color: getTrendColor(trend_type)}),
                            stroke: new ol.style.Stroke({color: '#000000', width: 1})
                        })
                    }));
                } else if (trend_type == "overThresholdDown") {
                    style = (new ol.style.Style({
                        image: new ol.style.RegularShape({
                            points: 3,
                            radius: 10,
                            rotation: 3.141592654,
                            fill: new ol.style.Fill({color: getTrendColor(trend_type)}),
                            stroke: new ol.style.Stroke({color: '#000000', width: 1})
                        })
                    }));
                } else if (trend_type == "noTrend" || trend_type == "") {
                    style = (new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 4,
                            fill: new ol.style.Fill({color: getTrendColor(trend_type)}),
                            stroke: new ol.style.Stroke({color: '#000000', width: 1})
                        })
                    }));
                }

                return style;

            }
        });

        clusters.setZIndex(1);

        let layers = [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    attributions: [getAttribution()],
                    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'
                })
            }),
            clusters
        ];

        const container = document.getElementById('popup');
        const content = document.getElementById('popup-content');
        const closer = document.getElementById('popup-closer');

        let overlay = new ol.Overlay({
            id: "marker",
            element: container,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });

        if (closer) {
            closer.onclick = function () {
                overlay.setPosition(undefined);
                closer.blur();
                return false;
            };
        }

        let view = new ol.View({
            projection: 'EPSG:4326',
            center: this.state.center,
            zoom: this.state.currentZoom,
            minZoom: 5.5,
            maxZoom: this.state.maxZoom
        });
        let theMap;

        let selectPoints = [];

        const that = this;

        theMap = new ol.Map({
            target: 'map',
            layers: layers,
            view: view,
            overlays: [overlay],
            controls: ol.control.defaults({
                attributionOptions: ({
                    collapsible: false
                })
            })
        });

        let selectItems = new ol.interaction.Select();
        theMap.addInteraction(selectItems);

        theMap.getView().on("change:resolution", function () {
            if (closer) {
                overlay.setPosition(undefined);
                closer.blur();
            }
        });

        theMap.on('singleclick', function (e) {
            selectItems.setActive(false);
            let featuresAtPixel = theMap.forEachFeatureAtPixel(e.pixel, function (featureChange) {
                return featureChange;
            });
            if (featuresAtPixel && featuresAtPixel.get('features')
                    != undefined && featuresAtPixel.get('features').length == 1) {
                const feature = featuresAtPixel.get('features')[0];
                that.popupHandler(feature, e.coordinate);
            } else {
                // Case when the click is anywhere else in the map
                if (closer) {
                    overlay.setPosition(undefined);
                    closer.blur();
                }
            }
        });

        const trends_legend_var = document.getElementById('trends_legend');

        const noTrendArrow = '<p class=' + styles.noValueLegend + ' style="background: ' +
            getTrendColor("noTrend") + '; border-color: ' +
            getTrendColor("noTrend") + '; margin-left: 1em;"></p>';

        const trendUpArrow = '<p class=' + styles.upArrowLegend + ' style="border-color: ' +
            getTrendColor("trendUp") + '; margin-left: 1em; "></p>';

        const trendDownArrow = '<p class=' + styles.downArrowLegend + ' style="border-color: ' +
            getTrendColor("trendDown") + '; margin-left: 1em;"></p>';

        const overThresholdUpArrow = '<p class=' + styles.upArrowLegend + ' style="border-color: ' +
            getTrendColor("overThresholdUp") + ';"></p>';

        const overThresholdDownArrow = '<p class=' + styles.downArrowLegend + ' style="border-color: ' +
            getTrendColor("overThresholdDown") + ';"></p>';

        if (trends_legend_var) {
            trends_legend_var.innerHTML =
                (
                    '<div class=' + styles.trends_legend_text + '>' +
                        trendUpArrow + ' - Trending Up <br/>' +
                        trendDownArrow + ' - Trending Down <br/>' +
                        noTrendArrow + ' - No Data Available <br/>' +
                        overThresholdUpArrow + overThresholdDownArrow + ' - Over Threshold  <br/>' +
                    '</div>'
                );
        }

        let areaPolygonSource = new ol.source.Vector({
            features: [
                new ol.Feature({})
            ]
        });

        this.setState({areaPolygonSource: areaPolygonSource});

        // This is for the Region Outlines
        let areaPolygonLayer = new ol.layer.Vector({
            id: "areaPolygon",
            source: areaPolygonSource,
            style: [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 152, 254, 1)',
                        width: 2
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(254, 254, 254, 0.3)'
                    })
                })
            ]
        });
        theMap.addLayer(areaPolygonLayer);

        centerHelper(view, vectorSource, theMap);

        this.setState({map: theMap});
    }

}

export default TrendsRegionMap;