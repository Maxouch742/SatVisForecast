async function import_TLE() {
    url = "https://celestrak.org/NORAD/elements/gp.php?GROUP=gnss&FORMAT=tle";
    return await getData(url);
}

async function get_height(east, north){
    url = `https://api3.geo.admin.ch/rest/services/height?easting=${east}&northing=${north}`;
    return await getData(url);
}

async function get_nf02_to_bessel(east, north, altitude=1000.0){
    url = `http://geodesy.geo.admin.ch/reframe/ln02tobessel?easting=${east}&northing=${north}&altitude=${altitude}&format=json`
    return await getData(url);
}

async function get_mn95_to_wgs84(east, north, altitude){
    url = `http://geodesy.geo.admin.ch/reframe/lv95towgs84?easting=${east}&northing=${north}&altitude=${altitude}&format=json`
    return await getData(url);
}

function getData(url){
    return $.ajax({
        url: url,
        type: 'GET',
        error: function (request, status, error){
            console.log(`Error : ${error}, status: ${status}`)
        }
    });
};

/** Request "GET" on API Celestrak (orbits of satellite vehicule) and
 * compute position of SV in time
 * 
 * @param {Object} observator : objet contenant la position MN95 du récepteur
 */
function getPositionSatellite(observator){

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