// required packages
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var fs = require('fs');

// read the data file
function readData(fileName) {
    let dataRead = fs.readFileSync('./data/' + fileName + '.json');
    let infoRead = JSON.parse(dataRead);
    return infoRead;
}

// read the data file
function writeData(info, fileName) {
    data = JSON.stringify(info);
    fs.writeFileSync('./data/' + fileName + '.json', data);
}

// update the data file
function combineCounts(name, value) {
    info = readData(name);
    var found = 0;
    for (var i = 0; i < info.length; i++) {
        if (info[i][name] === value) {
            info[i].count = parseInt(info[i].count) + 1;
            found = 1;
        }
    }
    if (found === 0) {
        info.push({
            [name]: value,
            count: 1
        });
    }
    writeData(info, name);
}

// Controller with GET/POST
module.exports = function(app) {

    // localhost:3333/analysis
    app.get('/analysis', function(req, res) {
        var simplicity = readData("simplicity");
        var layoutOpinion = readData("layoutOpinion");
        var designAspects = readData("designAspects");
        var leastFave = readData("leastFave");
        var comments = readData("comment");
        var navRating = readData("navRating");

        res.render('showResults', { results: [simplicity, layoutOpinion, designAspects, leastFave, navRating, comments] });
    });

    // serve a static html (the survey itself to fill in)
    app.get('/survey', function(req, res) {
        res.sendFile(__dirname + '/views/index.html');
    });

    // action.js POST information gets sent and processed here
    app.post('/survey', urlencodedParser, function(req, res) {
        console.log(req.body);
        var json = req.body;
        for (var key in json) {
            console.log(key + ": " + json[key]);
            if ((key === "designAspects") && (json[key].length === 2)) {
                for (var item in json[key]) {
                    combineCounts(key, json[key][item]);
                }
            } else {
                combineCounts(key, json[key]);
            }
        }
        res.sendFile(__dirname + "/views/index.html");
    });
};