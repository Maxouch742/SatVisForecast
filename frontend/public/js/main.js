
//////////////////////////////
// Initialize variables
//////////////////////////////

// TODO: continue: https://vscode.dev/github/taroz/GNSS-Radar/tree/master




import_TLE()
    .then(function (response){
        //console.log(response);

        list_TLE = response.split('\r\n');
        satellite_id = false
        message_TLE = false
        for (let i=0; i<list_TLE.length; i++){
            console.log(list_TLE[i]);

            // Affecter le nom du satellite
            if (satellite_id === false && message_TLE === false){
                satellite_id = list_TLE[i]
            }

            // Première ligne du TLE
            if (satellite_id !== false && message_TLE === false && list_TLE[i][0] === "1"){
                message_TLE = list_TLE[i]
            }

            // Deuxième ligne du TLE
            if (satellite_id !== false && message_TLE !== false && list_TLE[i][0] === "2"){

                // Ajouter le TLE au message
                message_TLE += '\n'
                message_TLE += list_TLE[i]

                const satrec = satellite.twoline2satrec(
                    message_TLE.split('\n')[0].trim(),
                    message_TLE.split('\n')[1].trim()
                )
                
                //TODO: compute position
                const date = new Date();
                const positionAndVelocity = satellite.propagate(satrec, date);
                const gmst = satellite.gstime(date);
                const position_geodetic = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
                const position_ecf = satellite.geodeticToEcf(position_geodetic);
                observator = {};
                const position_az_el = satellite.ecfToLookAngles(observator, position_ecf);   //TODO: trouver observator : {longitude, latitude}

                console.log(position.longitude, position.latitude);// in radians
                console.log(position.height);// in km
                console.log(" ")

                // Réinitialiser les variables
                satellite_id = false;
                message_TLE = false;

            }
        }
        

    })
    .catch(response_error => console.log(response_error));