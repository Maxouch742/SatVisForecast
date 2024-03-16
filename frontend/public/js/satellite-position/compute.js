/**
 * ------------------------------------------------------------------------
 *
 * This module ...
 *
 * ------------------------------------------------------------------------
 */

/**
 * 
 * @param {*} data 
 */
export function compute_satellite(data){
    console.log(data)

    // Global variables for get Two Line Element for Orbit satellite
    satellite_id = false
    message_TLE = false

    // Split message by CRLF for simplify reading
    list_TLE = data.split('\r\n');

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
}