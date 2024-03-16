/**
 * ---------------------------------------------------------------------
 * 
 * This module is responsible of making HTTP call to the API endpoints.
 * 
 * ---------------------------------------------------------------------
 */

import {
    GEODESY_API, 
    GEOADMIN_API,
    HTTP_METHODS,
    CELESTRAK_API
} from './constants.js'

/**
 * Convert swiss position (LV95) to international position (WGS84, GRS80)
 * Source: Geodetic REST Web services (REFRAME Web API), swisstopo, Report 16-03, 2016
 * 
 * @param {Number} east     East coordinate in meters [m] in LV95
 * @param {Number} north    North coordinate in meters [m] in LV95
 * @param {Number} altitude optionnal, Ellipsoidal height in meters [m] on Bessel
 * @returns
 */
export async function mn95ToWgs84(east, north, altitude=1000.0){
    const response = await fetch(`${GEODESY_API}/lv95towgs84?easting=${east}&northing=${north}&altitude=${altitude}&format=json`, {
        method: HTTP_METHODS.GET
    });
    const result = await response.json();
    return result
}


/**
 * Convert Swiss usual heights LN02 (leveling network) into ellipsoidal heights (on Bessel 1841).
 * Source: Geodetic REST Web services (REFRAME Web API), swisstopo, Report 16-03, 2016
 * 
 * @param {Number} east     East coordinate in meters [m] in LV95
 * @param {Number} north    North coordinate in meters [m] in LV95
 * @param {Number} altitude optionnal, Usual height in meters [m] in LN02
 * @returns 
 */
export async function nf02ToBessel(east, north, altitude=1000.0){
    const response = await fetch(`${GEODESY_API}/ln02tobessel?easting=${east}&northing=${north}&altitude=${altitude}&format=json`, {
        method: HTTP_METHODS.GET
    });
    const result = await response.json();
    return result
}


/**
 * Obtain usual height in meters in LN02 with planimetric coordinates (east, north in LV95)
 * Source: https://api3.geo.admin.ch/services/sdiservices.html#height
 * 
 * @param {Number} east  East coordinate in meters [m] in LV95
 * @param {Number} north North coordinate in meters [m] in LV95
 * @returns 
 */
export async function getHeightInNf02(east, north){
    const response = await fetch(`${GEOADMIN_API}/height?easting=${east}&northing=${north}`, {
        method: HTTP_METHODS.GET
    });
    const result = await response.json()
    return result
}


/**
 * 
 * 
 * @param {*} group 
 * @param {*} format 
 * @returns 
 */

export async function TleSatellite(group='GNSS', format='tle') {
    const response = await fetch(`${CELESTRAK_API}/gp.php?GROUP=${group}&FORMAT=${format}`, {
        method: HTTP_METHODS.GET
    });
    console.log(`${CELESTRAK_API}/gp.php?GROUP=${group}&FORMAT=${format}`);
    const result = await response.json();
    console.log(result);
    return result
}