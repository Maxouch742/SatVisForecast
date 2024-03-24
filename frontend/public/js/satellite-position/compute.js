/**
 * ------------------------------------------------------------------------
 *
 * This module ...
 *
 * ------------------------------------------------------------------------
 */

import {
    DEG2RAD,
    TUMIN,
    XPDOTP,
    OPSMODE,
    MINUTES_PER_DAY,
    EARTH_RADIUS_KM,
    XKE,
} from './constants.js'
import {
    days2mdhms,
    jday,
    computeDayYear
} from './time.js'
import {
    sgp4init
} from './other.js'


/**
 * Convert the JSON object into a 2-line text message corresponding 
 * to the orbit definition
 * Source: https://celestrak.org/NORAD/documentation/tle-fmt.php
 * Function : "twoline2rv" (https://github.com/shashwatak/satellite-js)
 * 
 * @param {JSON} json
 */
function convertJSON(json){

    const satrec = {}
    satrec.error = 0;

    // Decode first line
    satrec.satnum = json.NORAD_CAT_ID;
    satrec.epochyr = +json.EPOCH.split('-')[0].slice(-2);
    satrec.epochdays = computeDayYear(new Date(json.EPOCH));
    satrec.ndot = json.MEAN_MOTION_DOT;
    console.log("MEAN_MOTION_DOT", satrec.ndot);
    satrec.nddot = json.MEAN_MOTION_DDOT;
    satrec.bstar = json.BSTAR;
    
    // Decode second line
    satrec.inclo = json.INCLINATION;
    satrec.nodeo = json.RA_OF_ASC_NODE;
    satrec.ecco = json.ECCENTRICITY;
    satrec.argo = json.ARG_OF_PERICENTER;
    satrec.mo = json.MEAN_ANOMALY;
    satrec.no = json.MEAN_MOTION;

    //  ---- find no, ndot, nddot ----
    satrec.no   = satrec.no / XPDOTP; //   rad/min
    
    //  ---- convert to sgp4 units ----
    satrec.a = Math.pow( satrec.no*TUMIN , (-2.0/3.0) );
    satrec.ndot = satrec.ndot  / (XPDOTP*MINUTES_PER_DAY);  //   ? * minperday
    satrec.nddot = satrec.nddot / (XPDOTP*MINUTES_PER_DAY*MINUTES_PER_DAY);

    //  ---- find standard orbital elements ----
    satrec.inclo = satrec.inclo * DEG2RAD;
    satrec.nodeo = satrec.nodeo * DEG2RAD;
    satrec.argpo = satrec.argpo * DEG2RAD;
    satrec.mo = satrec.mo * DEG2RAD;

    satrec.alta = satrec.a*(1.0 + satrec.ecco) - 1.0;
    satrec.altp = satrec.a*(1.0 - satrec.ecco) - 1.0;

    // ---------------- temp fix for years from 1957-2056 -------------------
    // --------- correct fix will occur when year is 4-digit in tle ---------
    let year = 1900;
    if (satrec.epochyr < 57){
        year = satrec.epochyr + 2000;
    };

    const mdhms_result = days2mdhms(year, satrec.epochdays);
    const mon = mdhms_result.mon;
    const day = mdhms_result.day;
    const hr = mdhms_result.hr;
    const minute = mdhms_result.minute;
    const sec = mdhms_result.sec;
    satrec.jdsatepoch = jday(year, mon, day, hr, minute, sec);

    //  ---------------- initialize the orbit at sgp4epoch -------------------
    var sgp4init_parameters = {
        opsmode : OPSMODE,
        satn : satrec.satnum,
        epoch : satrec.jdsatepoch-2433281.5,
        xbstar : satrec.bstar,

        xecco : satrec.ecco,
        xargpo : satrec.argpo,
        xinclo : satrec.inclo,
        xmo : satrec.mo,
        xno : satrec.no,

        xnodeo : satrec.nodeo,
    };

    sgp4init(satrec, sgp4init_parameters);

    return satrec;
}

/**
 * 
 * @param {Array[JSON]} data 
 */
export function compute_satellite(data_satellite, observator, date){

    console.log(date);

    const ISS_TLE = 
        `1 24876U 97035A   24077.53997754 -.00000020  00000+0  00000+0 0  9991
         2 24876  55.6395 130.7141 0076551  52.2531 308.5023  2.00565528195471`;
    // Initialize the satellite record with this TLE
    const satrec = satellite.twoline2satrec(
        ISS_TLE.split('\n')[0].trim(), 
        ISS_TLE.split('\n')[1].trim()
    );
    console.log(satrec);
    const satrec2 = convertJSON({
        "OBJECT_NAME":"NAVSTAR 43 (USA 132)",
        "OBJECT_ID":"1997-035A",
        "EPOCH":"2024-03-17T12:57:34.059456",
        "MEAN_MOTION":2.00565528,
        "ECCENTRICITY":0.0076551,
        "INCLINATION":55.6395,
        "RA_OF_ASC_NODE":130.7141,
        "ARG_OF_PERICENTER":52.2531,
        "MEAN_ANOMALY":308.5023,
        "EPHEMERIS_TYPE":0,
        "CLASSIFICATION_TYPE":"U",
        "NORAD_CAT_ID":24876,
        "ELEMENT_SET_NO":999,
        "REV_AT_EPOCH":19547,
        "BSTAR":0,
        "MEAN_MOTION_DOT":-2.0e-7,
        "MEAN_MOTION_DDOT":0
    },);
    console.log(satrec2)
    
    /*
    // Course of data
    data_satellite.forEach((element) => {

        //TODO: parser json for TLE
        console.log(element)

        const satrec = convertJSON(element);

        // Compute 
        const positionAndVelocity = satellite.propagate(satrec, date);
        console.log(positionAndVelocity)
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

    });*/


    /*
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
    */
}
