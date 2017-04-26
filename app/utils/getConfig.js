/*
 * @flow
 */
import type { PropertiesType } from './flowtype'

export function getSourceName(source:PropertiesType):string {
    var sourcename = window.configruntime.sourcename;
    return sourcename[source.id] !== undefined ? sourcename[source.id] : source.title;
}

export function getLocationName(source:string):string {
    var named_locations = window.configruntime.named_locations;
    return named_locations[source] !== undefined ? named_locations[source] : source;
}

function capitalize(a:string):string {
    return a.charAt(0).toUpperCase() + a.slice(1);
}

export function getParameterName(parameter:string):string {
    var parameter_maps = window.configruntime.parameter_maps;
    return parameter_maps[parameter] !== undefined ? parameter_maps[parameter] :
        capitalize(parameter.replace(/-/g, " ")).replace(" mgl", " (mg/l)");
}