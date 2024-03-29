/**
 * ---------------------------------------------------------------------
 * 
 * This module is responsible of main process for compute topography
 * mask.
 * 
 * ---------------------------------------------------------------------
 */

import { request_profile } from "./api";
import { elevation, elevation_max, point_launched } from "./compute";


/**
 * Process for compute topography mask
 * 
 * @param {Array} coord_start 
 * @param {Number} height_instrument 
 */
export function process(coord_start, height_instrument){

    const tabpromise = [];

    // Iteration, on angles from 0 to 359
    for (let i=0; i<360; i++){

        const coord_end = point_launched(coord_start, i);
        const profile = request_profile(coord_start, coord_end);
        tabpromise.push(profile);
    }

    ok = Promise.all(tabpromise).then(results => {
        data = elevation(results, coord_start, height_instrument);
        mask = elevation_max(data);
        return mask
    });
    // TODO: trouver une solution pour exporter les résultats
}