/**
 * ------------------------------------------------------------------------
 *
 * This module is the entry point of the application.
 * It wires the business logic on the web page,
 * like some kind of "controller".
 *
 * ------------------------------------------------------------------------
 */

import { date_parsed } from './satellite-position/time.js';
import { getHeightInNf02, nf02ToBessel, mn95ToWgs84, TleSatellite } from './satellite-position/api.js';
import { compute_satellite } from './satellite-position/compute.js';



/**
 * 
 * @param {*} observator_position 
 * @param {string} date 
 */
function satellite_function(observator_position, date){

    const date_obj = new Date(date);
    console.log(date_obj);

    const height_NF02_api = getHeightInNf02(observator_position.east, observator_position.north);
    height_NF02_api
        .then(function(response) {
            // Add element to observator Object
            observator_position.height_NF02 = parseFloat(response.height);

            // NF02 Height to Bessel's height
            return nf02ToBessel(observator_position.east, observator_position.north, observator_position.height_NF02)})
        .then(function(response){
            // Add element to observator Object
            observator_position.height_bessel = parseFloat(response.altitude);

            // MN95/Bessel to WGS84:
            return mn95ToWgs84(observator_position.east, observator_position.north, observator_position.height_bessel)})
        .then(function(response){
            // Add element to observator Object
            observator_position.latitude = parseFloat(response.easting);
            observator_position.longitude = parseFloat(response.northing);
            observator_position.height = parseFloat(response.altitude);

            // Compute position's SV
            return TleSatellite('json')})
        .then(function(response){ 
            // Compute position satellite
            compute_satellite(response, observator_position, date_obj);
        })
        .catch(console.log("ERROR"));
}

const pos = {
    'east':2600000.0,
    'north':1200000.0,
};
satellite_function(pos, "2024-02-29T19:02");
