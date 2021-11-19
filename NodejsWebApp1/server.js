const csv = require('csv-parser');
const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 1337;

var rawData = [];

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/data', function (req, res) {
    rawData = [];
    fs.createReadStream('unisexNames.csv')
        .pipe(csv())
        .on('data', (row) => rawData.push(row))
        .on('end', () => {
            res.render('pages/data', {
                maleData: transformData(5, filters.MALE),
                femaleData: transformData(5, filters.FEMALE)
            });
            console.log('CSV read')
        });
});

function transformData(count, filter) {
    var tempData = rawData;

    if (filter === filters.MALE) {
        tempData.sort(function (a, b) {
            return b.male_share - a.male_share;
        });
    } else if (filter === filters.FEMALE) {
        tempData.sort(function (a, b) {
            return b.female_share - a.female_share;
        });
    }

    return tempData.slice(0, count);
}

app.listen(port);

console.log('Listening on port ' + port);

const filters = {
    MALE: "male",
    FEMALE: "female"
}