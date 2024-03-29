/**
 * ---------------------------------------------------------------------
 * 
 * This module is responsible of making HTTP call to the API endpoints.
 * 
 * ---------------------------------------------------------------------
 */

import {
    GEOADMIN_API, 
    NB_POINT,
} from './constants.js'


/**
 * Request profile on api3.geo.admin
 * 
 * @param {Array} coord_start 
 * @param {Array} coord_end 
 * @returns 
 */
export function request_profile(coord_start, coord_end){

    // Build address
    const api_profil = `${GEOADMIN_API}/profile.json?nb_points=${NB_POINT}&geom={"type":"LineString","coordinates":[[${coord_start[0].toFixed(4)},${coord_start[1].toFixed(4)}],[${coord_end[0].toFixed(4)},${coord_end[1].toFixed(4)}]]}`;

    // Get request
    let promise = fetch(api_profil)
        .then(response => {
            // Display error if response is not ok
            if (!response.ok){
                throw new Error(`Request's error: ${response.status}`);
            }
            return response.json();
        })
    return promise;
}