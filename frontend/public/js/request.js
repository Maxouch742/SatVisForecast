async function import_TLE() {
    url = "https://celestrak.org/NORAD/elements/gp.php?GROUP=gnss&FORMAT=tle";
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