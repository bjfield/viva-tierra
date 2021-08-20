<script>

var produceData = {};
var t = [];

var parseSheet = {
  Varieties: function(rows) {
    for (var r = 1; r < rows.length; r++) {
      var row = rows[r];
      if (!produceData[row[0]]) produceData[row[0]] = {};
      if (!produceData[row[0]].cultivars) produceData[row[0]].cultivars = {};
      produceData[row[0]].cultivars[row[1]] = {
        "name": row[1],
        "season": row[2],
        "description": row[3],
        "plu": row[4],
        "usDatabar": row[5],
        "packs": []
      };
    }
  },
  Packs: function(rows) {
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      if (!produceData[row[0]]) produceData[row[0]] = {};
      if (!produceData[row[0]].cultivars) produceData[row[0]].cultivars = {};
      if (!produceData[row[0]].cultivars[row[1]]) produceData[row[0]].cultivars[row[1]] = {};
      if (!produceData[row[0]].cultivars[row[1]].packs) produceData[row[0]].cultivars[row[1]].packs = [];
      produceData[row[0]].cultivars[row[1]].packs.push({
        "weight": row[2],
        "grade": row[3],
        "size": row[4],
        "upc": row[5]
      });
    }
  },
  Specs: function(rows) {
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      if (!produceData[row[0]]) produceData[row[0]] = {};
      if (!produceData[row[0]].specs) produceData[row[0]].specs = [];
      produceData[row[0]].specs.push({
        "pack": row[1],
        "stickers": row[2],
        "net": row[3],
        "gross": row[4],
        "size": row[5],
        "quantity": row[6]
      });
    }
  },
  Fields: function(rows) {
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      if (!produceData[row[0]]) produceData[row[0]] = {};
      if (!produceData[row[0]].fields) produceData[row[0]].fields = {};
      if (!produceData[row[0]].fields[row[1]]) produceData[row[0]].fields[row[1]] = [];
      produceData[row[0]].fields[row[1]].push({
        "column": row[2],
        "key": row[3]
      });
    }
  }
};

var queryStringValue = function(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

var isFunction = function(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};

var mergeData = function() {

  t.push(performance.now());

  // Select the correct produce data object based on the page URL.
  var produce,
      produceId = location.pathname.split('/')[2];
  if (!produceData[produceId]) {
    console.log("Invalid produce category identifier (" + produceId + ").");
    return;
  } else {
    produce = produceData[produceId];
  }

  // Select the correct variety/cultivar data object based on the page URL.
  var variety,
      varietyId = queryStringValue('variety');
  if (varietyId === null) {
    varietyId = Object.keys(produce.cultivars)[0];
  }
  if (!produce.cultivars[varietyId]) {
    console.log("Invalid produce variety (" + produceId + ":" + varietyId + ").");
    return;
  } else {
    variety = produce.cultivars[varietyId];
  }

  // Specify which HTML elements will be filled with which data.
  var map = [{
    selector: '.sqs-block-content h1',
    data: variety.name
  }, {
    selector: '.sqs-block-content p',
    data: variety.description
  }, {
    selector: '.sqs-block-content h2',
    data: variety.season
  }, {
    selector: '.sqs-block-content h3',
    data: '<strong>PLU</strong><br />' + variety.plu + '<br /><br /><strong>US Databar</strong><br />' + variety.usDatabar
  }, {
    selector: '#table_upc h4',
    data: function() {
      if (variety.packs.length > 0) {
        return variety.name + ' Consumer Packs';
      } else {
        return variety.name + ' Packs — Tray Pack Only';
      }
    }
  }, {
    selector: '#table_upc thead',
    data: function() {
      if (variety.packs.length > 0) {
        var html = '';
        html += '<tr>';
        for (var f = 0; f < produce.fields.pack.length; f++) {
          html += '<th>' + produce.fields.pack[f].column + '</th>'
        }
        html += '</tr>';
        return html;
      } else {
        return '';
      }
    }
  }, {
    selector: '#table_upc tbody',
    data: function() {
      if (variety.packs.length > 0) {
        var html = '';
        for (var p = 0; p < variety.packs.length; p++) {
          html += '<tr>';
          for (var f = 0; f < produce.fields.pack.length; f++) {
            html += '<td>' + variety.packs[p][produce.fields.pack[f].key] + '</td>'
          }
          html += '</tr>';
        }
        return html;
      } else {
        return '';
      }
    }
  }, {
    selector: '#table_specs tbody',
    data: function() {
      var html = '';
      for (var s = 0; s < produce.specs.length; s++) {
        html += '<tr><td>' + produce.specs[s].pack + '</td><td>' + produce.specs[s].stickers + '</td><td>' + produce.specs[s].net + '</td><td>' + produce.specs[s].gross + '</td><td>' + produce.specs[s].size + '</td><td>' + produce.specs[s].quantity + '</td></tr>'
      }
      return html;
    }
  }];

  // Perform the data merge.
  for (var i = 0; i < map.length; i++) {
    var data = map[i].data;
    if (isFunction(data)) {
      data = map[i].data();
    }
    if (typeof(map[i].attribute) !== 'undefined') {
      Y.one(map[i].selector).setAttribute(map[i].attribute, data);
    } else {
      Y.one(map[i].selector).setHTML(data);
    }
  }

  // Update the product image.
  var thumb = Y.one('a[href*="variety=' + variety.name.replace(/\s+/gi, '+') + '"] > img.thumb-image');
  if (thumb) {
    var dataset = thumb._node.dataset;
    variety.image = {
      src: dataset.image,
      width: parseInt(dataset.imageDimensions.split('x')[0]),
      height: parseInt(dataset.imageDimensions.split('x')[1]),
      focalX: parseFloat(dataset.imageFocalPoint.split(',')[0]),
      focalY: parseFloat(dataset.imageFocalPoint.split(',')[1]),
      id: dataset.imageId,
      alt: variety.name,
      resolution: '750w'
    };

    // Images need a little extra TLC to look okay across all products.
    var mainImage = Y.one('.image-block-wrapper img');
    mainImage.setAttribute('data-src', variety.image.src);
    mainImage.setAttribute('data-image', variety.image.src);
    mainImage.setAttribute('data-image-dimensions', variety.image.width + 'x' + variety.image.height);
    mainImage.setAttribute('data-image-focal-point', variety.image.focalX.toFixed(1) + 'y' + variety.image.focalY.toFixed(1));
    mainImage.setAttribute('data-image-id', variety.image.id);
    mainImage.setAttribute('src', variety.image.src + '?format=' + variety.image.resolution);
    mainImage.setAttribute('data-image-resolution', variety.image.resolution);
    var styleString = 'position: absolute; ';
    if (variety.image.width > variety.image.height) {
      styleString += 'top: 0%; left: -' + ((variety.image.width / variety.image.height * 100 - 100) / 2) + '%; width: ' + (variety.image.width / variety.image.height * 100) + '%; height: 100%;';
    } else {
      styleString += 'left: 0%; top: -' + ((variety.image.height / variety.image.width * 100 - 100) / 2) + '%; height: ' + (variety.image.height / variety.image.width * 100) + '%; width: 100%;';
    }
    mainImage.setAttribute('style', styleString);
    mainImage.setAttribute('alt', variety.image.alt);

    // Adjust the background image of the page to accomodate new content.
    Y.one('#siteWrapper').setStyle('background-position-y', parseInt(Y.one('#table_specs').getY() - Y.one('#header').height()) + 'px');
  }

  // Show the main page content (after data merge).
  var main = document.getElementById('page');
  main.style.visibility = "visible";

  t.push(performance.now());
  console.log(`Merge took ${t[4] - t[3]} milliseconds.`);

}

var parseProduceData = function(googleData) {
  t.push(performance.now());
  console.log(`Fetch took ${t[1] - t[0]} milliseconds.`);
  parseSheet.Varieties(googleData.valueRanges[0].values);
  parseSheet.Packs(googleData.valueRanges[1].values);
  parseSheet.Specs(googleData.valueRanges[2].values);
  parseSheet.Fields(googleData.valueRanges[3].values);
  t.push(performance.now());
  console.log(`Parse took ${t[2] - t[1]} milliseconds.`);
  if (document.readyState === 'complete') {
    mergeData();
  } else {
    Y.on('load', mergeData);
  }
}

t.push(performance.now());

</script>
<!--
<script src="https://sheets.googleapis.com/v4/spreadsheets/1QWZxkGFpMtCDYi2J4fKZlJxJJL-VJwmR6ug2qwZF4MU/values:batchGet?ranges=Varieties&ranges=Packs&ranges=Specs&ranges=Fields&key=AIzaSyAthY6sWzvwh-QdvDNkb45dYCWuLrn_fRQ&callback=parseProduceData"></script>
-->

<script>

  var scripts = {
//     "data": "/s/data-20210217.js",
//  "produce": "/s/produce-20210217.js",
//  "produce": "/s/produce-20210220.js",
    "data": "https://sheets.googleapis.com/v4/spreadsheets/1QWZxkGFpMtCDYi2J4fKZlJxJJL-VJwmR6ug2qwZF4MU/values:batchGet?ranges=Varieties&ranges=Packs&ranges=Specs&ranges=Fields&key=AIzaSyAthY6sWzvwh-QdvDNkb45dYCWuLrn_fRQ&callback=parseProduceData",
    "contact": "/s/contact-6lha.js"
  }

  var pages = {
    "Retailers": {
      "class": "vt-contact",
      "scripts": ["data", "contact"]
    },
    "Apples": {
      "class": "vt-organics vt-apples",
      "scripts": ["data", "produce"]
    },
    "Pears": {
      "class": "vt-organics vt-pears",
      "scripts": ["data", "produce"]
    },
    "Stone Fruit": {
      "class": "vt-organics vt-stone-fruit",
      "scripts": ["data", "produce"]
    },
    "Kiwifruit": {
      "class": "vt-organics vt-kiwifruit",
      "scripts": ["data", "produce"]
    },
    "Onions": {
      "class": "vt-organics vt-onions",
      "scripts": ["data", "produce"]
    }
  }

  function prepare(name) {
    if (pages.hasOwnProperty(name)) {
      var page = pages[name];
      if (page.hasOwnProperty("class")) {
        document.getElementsByTagName('html')[0].className += " " + page.class;
      }
      if (page.hasOwnProperty("scripts")) {
        page.scripts.forEach(function(name) {
          if (scripts.hasOwnProperty(name)) {
            var script = document.createElement('script');
            script.src = scripts[name];
            script.async = false;
            document.head.appendChild(script);
          }
        });
      }
    }
  }

</script>
