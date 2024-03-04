async function getData(url){
    return await $.ajax({
        url: url,
        type: 'GET',
        error: function (request, status, error){
            console.log(`Error : ${error}, status: ${status}`)
        }
    });
};