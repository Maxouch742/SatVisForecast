/**
 * Import du fichier 'celestrak.txt' avec les définitions des orbites
 * pour chaque satellite
 */

function importTLE() {
    
    // Read file
    const reader = new FileReader();

    reader.onload = function () {
        const content = reader.result();
        console.log(content);
    };

    reader.onerror = function () {
        console.log("Oops: error reading the file");
    };

    reader.readAsText('celestrak.txt');

}