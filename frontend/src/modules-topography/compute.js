import { DEG2RAD, MAX_DISTANCE, RAD2DEG } from "./constants";


export function point_launched(coord_sta, angle){

    const point_easting = coord_sta[0] + Math.sin(angle * DEG2RAD) * MAX_DISTANCE;
    const point_northing = coord_sta[1] + Math.cos(angle * DEG2RAD) * MAX_DISTANCE;

    return [point_easting, point_northing];
}

export function elevation(results, coord_base, height_instrument){

    results.forEach(element => {

        let firstIteration = true;

        element.forEach((observation, i) => {

            if (!firstIteration){
                const dh = observation.alts.DTM25 - (element[0].alts.DTM25 + height_instrument);
                const elev = Math.atan(dh / observation.dist) * RAD2DEG;
                const delta_E = observation.easting - coord_base[0];
                const delta_N = observation.northing - coord_base[1];
                let azi = Math.atan2(delta_N, delta_E)*RAD2DEG;
                if (azi < 0){
                    azi += 360.0;
                };
                element[i].elevation = elev;
                element[i].azimut = azi;
            }
            else {
                // Insert value for the first point in the profile
                element[i].elevation = 0.0;
                element[i].elevation = 0.0;
                firstIteration = false;
            }
        })
    })
    return results
}