function addImdb(info, container) {
    container.addClass('imdb_processed imdb_pending');
    chrome.runtime.sendMessage(info, function(response) {
        container.removeClass('imdb_pending');
        var imdb = `<a target="_blank" href="http://www.imdb.com/title/${response.imdbID}/" class="imdb"><img src="${chrome.extension.getURL('imdb.svg')}"><span class="rating">${response.imdbRating ? response.imdbRating : response.Error}</span></a>`;
        container.find('.meta').append(imdb);
    });
}
function jawBone() {
    var jawBones = $('.jawBone:not(.imdb_processed)');
    if (jawBones.length) {
        jawBones.each(function(i, jawBone) {
            jawBone = $(jawBone)
            var title = jawBone.find('.title').text();
            title = title || jawBone.find('.title img').attr('alt');
            var year = jawBone.find('.meta .year').text();
            if (title && year) {
                addImdb({
                    t: title,
                    y: year
                },jawBone);
            }
        });
    }
}
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if ($(mutation.target).is('.hasBob')) {
            var bob_card = $(mutation.target).find('.bob-card:not(.imdb_processed)');
            var bob_title = bob_card.find('.bob-info .bob-title').text();
            var bob_year = bob_card.find('.bob-info .meta .year').text();
            if (bob_title) {
                if (bob_year) {
                    addImdb({
                        t: bob_title,
                        y: bob_year
                    }, bob_card);
                } else {
                    setTimeout(function() {
                        addImdb({
                            t: bob_title,
                            y: bob_year
                        }, bob_card);
                    }, 100);
                }
            }
        }
        if ($(mutation.target).is('.title_card.highlighted')) {
            jawBone();
        }
    });
}
);
observer.observe(document, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
});

$(function() {
    setTimeout(jawBone, 1000);
})
