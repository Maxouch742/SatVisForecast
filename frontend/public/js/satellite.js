/**
 * Requête sur l'API de celestrak pour récupérer les éléments orbitaux
 */

function import_TLE() {

    url = "https://celestrak.org/NORAD/elements/gp.php?GROUP=gnss&FORMAT=json";

    getData(url)
        .then(computePosition)
        .catch(response => console.log(response));

}


function computePosition(orbits){
    console.log(orbits);

    for (let i=0; i<=orbits.length; i++){
        let year = 0;
        console.log(i);
    }
}