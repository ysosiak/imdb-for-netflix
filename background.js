const API_URL = 'https://www.omdbapi.com/';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    var key = Object.values(request).join()
    chrome.storage.local.get(key, function(result) {
        if ($.isEmptyObject(result)) {
            $.getJSON(API_URL, request, function(response) {
                console.log(response)
                var obj = {};
                obj[key] = {
                    imdbID: response.imdbID,
                    imdbRating: response.imdbRating,
                    Error: response.Error,
                    exp: Date.now() + 604800000 // Cache result for week
                };
                chrome.storage.local.set(obj)
                sendResponse(response)
            })
        } else {
            if (result[key].exp < Date.now()) {
                chrome.storage.local.remove(key)
            }
            console.log(result)
            sendResponse(result[key])
        }
    })
    return true;
})
