/**
 * ------------------------------------------------------------------------
 *
 * This module is the entry point of the application.
 * It wires the business logic on the web page,
 * like some kind of "controller".
 *
 * ------------------------------------------------------------------------
 */

import { 
    getHeightInNf02, 
    nf02ToBessel, 
    mn95ToWgs84,
    TleSatellite
} from './satellite-position/api.js'
import {
    compute_satellite
} from './satellite-position/compute.js'


function satellite_function(observator_position){

    const height_NF02_api = getHeightInNf02(observator_position.east, observator_position.north);
    height_NF02_api
        .then(function(response) {
            // Add element to observator Object
            observator_position.height_NF02 = parseFloat(response.height);

            // NF02 Height to Bessel's height
            const height_bessel_api = nf02ToBessel(observator_position.east, observator_position.north, observator_position.height_NF02);
            height_bessel_api
                .then(function(response){
                    // Add element to observator Object
                    observator_position.height_bessel = parseFloat(response.altitude);

                    // MN95/Bessel to WGS84:
                    const position_wgs84 = mn95ToWgs84(observator_position.east, observator_position.north, observator_position.height_bessel);
                    position_wgs84
                        .then(function(response){
                            // Add element to observator Object
                            observator_position.latitude = parseFloat(response.easting);
                            observator_position.longitude = parseFloat(response.northing);
                            observator_position.height = parseFloat(response.altitude);

                            // Compute position's SV
                            const requestSatellite = TleSatellite();
                            requestSatellite
                                //.then(response => compute_satellite(response, observator_position))
                                .then(function(response){
                                    console.log(response);
                                    compute_satellite(response);
                                })
                                .catch(console.log("ERROR: IMPORT SATELLITE"));

                            

                        })
                        .catch(console.log("ERROR: MN95 to WGS84")); 


                })
                .catch(console.log("ERROR: height NF02 to Bessel"));


        })
        .catch(console.log("ERROR: height in NF02"));
    
    

}

const pos = {
    'east':2600000.0,
    'north':1200000.0,
};
satellite_function(pos)


/*
positionSV = {}

    // Convert position MN95 to WGS84
    // First, obtain ellipsoidal height on Bessel
    get_nf02_to_bessel(observator.east, observator.north)
        .then(function (response){
            // Add ellipsoidal height to position's object
            observator.height_bessel = response.altitude;

            // Get WGS84 position from MN95 position
            get_mn95_to_wgs84(observator.east, observator.north, observator.altitude)
                .then(function (response){

                    // Add WGS84 position
                    observator.longitude = response.easting;
                    observator.latitude = response.northing;
                    observator.height_grs = response.altitude;

                    // TODO : import_TLE()
                })
                .catch(response_error => console.log(`[ERROR] ${response_error}`));

        })
        .catch(response_error => console.log(`[ERROR] ${response_error}`));

    // Request on Celestrak' API
    import_TLE()
        .then(function (response){

            // Global variables for get Two Line Element for Orbit satellite
            satellite_id = false
            message_TLE = false
            
            // Split message by CRLF for simplify reading
            list_TLE = response.split('\r\n');

            for (let i=0; i<list_TLE.length; i++){

                // Get name of satellite
                if (satellite_id === false && message_TLE === false){
                    satellite_id = list_TLE[i];
                    console.log(' ');
                    console.log(satellite_id);
                }

                // First line of TLE
                if (satellite_id !== false && message_TLE === false && list_TLE[i][0] === "1"){
                    message_TLE = list_TLE[i]
                }

                // Second line of TLE
                if (satellite_id !== false && message_TLE !== false && list_TLE[i][0] === "2"){

                    // Add line to global variable
                    message_TLE += '\n'
                    message_TLE += list_TLE[i]

                    // Get object from satellite-js to TLE message
                    const satrec = satellite.twoline2satrec(
                        message_TLE.split('\n')[0].trim(),
                        message_TLE.split('\n')[1].trim()
                    )
                    
                    // Date 
                    const date = new Date();

                    // compute position
                    const positionAndVelocity = satellite.propagate(satrec, date);
                    const gmst = satellite.gstime(date);
                    const position_geodetic = satellite.eciToGeodetic(positionAndVelocity.position, gmst);  // returns in radians
                    const position_ecf = satellite.geodeticToEcf(position_geodetic);
                    const position_az_el = satellite.ecfToLookAngles(observator, position_ecf);  // angles in radians
                    const azi = position_az_el["azimuth"] * 180.0 / Math.PI;
                    const ele = position_az_el["elevation"] * 180.0 / Math.PI;

                    console.log("Position géodésique :");
                    console.log(`Long: ${position_geodetic.longitude.toFixed(2)}, Lat: ${position_geodetic.latitude.toFixed(2)}, H: ${position_geodetic.height.toFixed(2)}`); 
                    console.log("Azimut Elevation :");
                    console.log(`Azi: ${position_az_el["azimuth"].toFixed(2)}, El: ${position_az_el["elevation"].toFixed(2)} [rad]`);
                    console.log(`Azi: ${azi.toFixed(2)}, El: ${ele.toFixed(2)} [deg]`);
                    
                    // TODO : Export value

                    // Reinit variables for next message
                    satellite_id = false;
                    message_TLE = false;
                }
            }
            

        })
        // Display error
        .catch(response_error => console.log(`[ERROR] ${response_error}`));
    }
    */