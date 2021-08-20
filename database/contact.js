for (key in produceData) {
    produceData[key].get = function(cultivar) {
        for (var c = 0; c < this.cultivars.length; c++) {
            if (this.cultivars[c].name === cultivar) {
                return this.cultivars[c];
            }
        }
    };
}

var isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
};

var map = [{
    selector: '#specs_apples tbody',
    data: function() {
        var html = '';
        var produce = produceData.apples;
        for (var s = 0; s < produce.specs.length; s++) {
            html += '<tr><td>' + produce.specs[s].pack + '</td><td>' + produce.specs[s].stickers + '</td><td>' + produce.specs[s].net + '</td><td>' + produce.specs[s].gross + '</td><td>' + produce.specs[s].size + '</td><td>' + produce.specs[s].quantity + '</td></tr>'
        }
        return html;
    }
}];

var fruits = ['apples', 'pears', 'stone-fruit', 'kiwifruit', 'onions'];

Y.on('domready', function() {

    for (var f = 0; f < fruits.length; f++) {
        // Specs Tables
        var selector = '#specs_' + fruits[f] + ' tbody';
        var html = '';
        var produce = produceData[fruits[f]];
        for (var s = 0; s < produce.specs.length; s++) {
            html += '<tr><td>' + produce.specs[s].pack + '</td><td>' + produce.specs[s].stickers + '</td><td>' + produce.specs[s].net + '</td><td>' + produce.specs[s].gross + '</td><td>' + produce.specs[s].size + '</td><td>' + produce.specs[s].quantity + '</td></tr>'
        }
        Y.one(selector).setHTML(html);

        // Links
        var fruit = fruits[f];
        var produce = produceData[fruit];
        var linkTable = document.querySelector('#links_' + fruit);
        linkTable.innerHTML = '<div class="col sqs-col-3 span-3"><div class="sqs-block html-block sqs-block-html"><div class="sqs-block-content"><p>—</p></div></div></div><div class="col sqs-col-3 span-3"><div class="sqs-block html-block sqs-block-html"><div class="sqs-block-content"><p>—</p></div></div></div><div class="col sqs-col-3 span-3"><div class="sqs-block html-block sqs-block-html"><div class="sqs-block-content"><p>—</p></div></div></div><div class="col sqs-col-3 span-3"><div class="sqs-block html-block sqs-block-html"><div class="sqs-block-content"><p>—</p></div></div></div></div>';
        var columnCount = 4;
        var cultivarNames = Object.keys(produce.cultivars);
        if (cultivarNames.length > 4) {
            var fruitsPerColumn = Math.floor(cultivarNames.length / columnCount);
            for (var c = 0; c < columnCount; c++) {
                var selector = '#links_' + fruit + ' div:nth-child(' + (c + 1) + ') div div p';
                var links = [];
                for (var r = 0; r < fruitsPerColumn; r++) {
                    var k = c * fruitsPerColumn + r;
                    var cultivar = produce.cultivars[cultivarNames[k]];
                    if (typeof cultivar !== 'undefined') {
                        links.push('<a href="/organics/' + fruit + '/?variety=' + encodeURI(cultivar.name) + '">' + cultivar.name + '</a>');
                    }
                }
                var html = links.join('<br>\r\n');
                Y.one(selector).ancestor(".code-block").setStyle('padding', 0);
                Y.one(selector).setHTML(html);
            }
        } else {
            var selector = '#links_' + fruit;
            var links = [];
            for (var i = 0; i < cultivarNames.length; i++) {
                var cultivar = produce.cultivars[cultivarNames[i]];
                links.push('<a href="/organics/' + fruit + '/?variety=' + encodeURI(cultivar.name) + '">' + cultivar.name + '</a>');
            }
            var html = '<div class="col sqs-col-12 span-12"><div class="sqs-block html-block sqs-block-html"><p class="text-align-center">' + links.join('&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;') + '</p></div></div>';
            Y.one(selector).setHTML(html);
        }
    }

});
