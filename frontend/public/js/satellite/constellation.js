/**
 * Detecting satellite constellation
 * 
 * @param {JSON} object_name 
 * @returns 
 */
export function constellation(object_name){

    console.log(object_name);

    let constellation_gnss = false;

    if (object_name.includes("NAVSTAR")){ constellation_gnss = "GPS" }
    else if (object_name.includes("BEIDOU")){ constellation_gnss = "BEIDOU" }
    else if (object_name.includes("GALILEO")){ constellation_gnss = "GALILEO" }
    else if (object_name.includes("IRNSS")){ constellation_gnss = "IRNSS" }
    else if (object_name.includes("QZS")){ constellation_gnss = "QZSS" }
    else if (object_name.includes("COSMOS")){ constellation_gnss = "GLONASS"}

    return constellation_gnss
}