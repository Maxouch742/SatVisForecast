/**
 * ---------------------------------------------------------------------
 * 
 * This module is responsible of functions in computations.
 * 
 * ---------------------------------------------------------------------
 */

import { DEG2RAD, MAX_DISTANCE, RAD2DEG } from "./constants";

/**
 * Compute point launched with base coordinates and angle.
 * 
 * @param {Array} coord_sta 
 * @param {Number} angle 
 * @returns {Array}
 */
export function point_launched(coord_sta, angle){

    const point_easting = coord_sta[0] + Math.sin(angle * DEG2RAD) * MAX_DISTANCE;
    const point_northing = coord_sta[1] + Math.cos(angle * DEG2RAD) * MAX_DISTANCE;

    return [point_easting, point_northing];
}


/**
 * 
 * @param {*} observation 
 * @param {*} coordinates 
 * @returns 
 */
function gisement(observation, coordinates){
    const delta_E = observation.easting - coordinates[0];
    const delta_N = observation.northing - coordinates[1];
    let phi = Math.atan2(delta_N, delta_E) * RAD2DEG;
    if (phi < 0){ phi += 360.0 }
    return phi;
}


/**
 * 
 * @param {*} observation 
 * @param {*} dh 
 * @returns 
 */
function elevation(observation, dh){
    const elev = Math.atan(dh / observation.dist) * RAD2DEG;
    return elev
}


/**
 * Compute elevation for each profile and each point in profile
 * 
 * @param {Array} results 
 * @param {Array} coord_base 
 * @param {Number} height_instrument 
 * @returns 
 */
export function calcElevation(results, coord_base, height_instrument){

    results.forEach(element => {

        let firstIteration = true;

        element.forEach((observation, i) => {

            if (!firstIteration){
                const dh = observation.alts.DTM25 - (element[0].alts.DTM25 + height_instrument);

                if (dh >= 0){
                    // Compute azimut and elevation
                    const elev = elevation(observation, dh);
                    const phi = gisement(observation, coord_base);
                    
                    // Push orientation and elevation in the profile
                    element[i].elevation = elev;
                    element[i].phi = phi;
                
                } else {

                    // Compute azimut because elevation is 0
                    const phi = gisement(observation, coord_base);
                    
                    // Push orientation and elevation at 0 in the profile
                    element[i].elevation = 0.0;
                    element[i].phi = phi;

                }
            }
            else {
                // Insert value for the first point in the profile
                element[i].elevation = 0.0;
                element[i].phi = 0.0;
                firstIteration = false;
            }
        })
    })
    return results
}

/**
 * Find elevation max in profil
 * 
 * @param {Array} data 
 * @returns 
 */
export function maxElevation(data){

    const mask_elevation = [];
    data.forEach(profile => {
        
        // Create list of elevation for a profile
        const list_elevation = profile.map(obj => obj.elevation);

        // Find the hight value of elevation in the list
        const max_elevation = Math.max(...list_elevation);

        let obser_max_elevation;

        // TODO:      
        if ( max_elevation === 0.0){

            // Take a value in a profile just for the orientation
            obser_max_elevation = profile[50];
            
        } else {
            // Find the index of the place for the max elevation
            const index_max_value = list_elevation.findIndex(value => value === max_elevation);

            // Get Object in response array
            obser_max_elevation = profile[index_max_value];

        }
        // Push the observation in the list
        mask_elevation.push(obser_max_elevation);
    });
    return mask_elevation;
}