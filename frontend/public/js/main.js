/**
 * ---------------------------------------------------------------------
 * 
 * MAIN SCRIPT
 * 
 * ---------------------------------------------------------------------
 */

import { TleSatellite, nf02ToBessel, mn95ToWgs84 } from './satellite/api.js';
import { compute_satellite } from './satellite/compute.js';

// Global variables
let tle_message = []

// Fully loaded web page
$(document).ready(function () {

    // Download TLE Message
    TleSatellite('json')
        .then(function(response){ 

            tle_message = response
        
            //----------------- Compute receiver position
            // Recover user-recorded date and time (TODO: get element in balise)
            const date = new Date();
            console.log(date);

            // Get receiver's position (TODO: get element in balise)
            const obs_position = {
                "east": 2600000.0,
                "north": 1200000.0,
                "height_NF02": 500.0,
            };

            // Compute position WGS84 from MN95 position
            const height_bessel = nf02ToBessel(obs_position.east, obs_position.north, obs_position.height_NF02)
                .then(function(response){
                    // Add element to observator Object
                    obs_position.height_bessel = parseFloat(response.altitude);

                    // MN95/Bessel to WGS84:
                    return mn95ToWgs84(obs_position.east, obs_position.north, obs_position.height_bessel)
                })
                .then(function(response){
                    // Add element to observator Object
                    obs_position.latitude = parseFloat(response.easting);
                    obs_position.longitude = parseFloat(response.northing);
                    obs_position.height = parseFloat(response.altitude);

                    // Compute position's SV
                    const res = compute_satellite(obs_position, date, tle_message);
                    console.log(res);
                })
                
        })
        .catch(error => console.log("ERROR", error));
});
