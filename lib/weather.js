'use strict';

var http = require('http');
var dateFormat = require('dateformat');

var Weather = function Constructor(settings) {
    this.settings = settings;
    this.APP_ID = '5889cc8ffcea65e69dee2937feab22f3';
};

module.exports = Weather;

Weather.prototype.getWeather = function (city, botCallback) {
    var _this = this;
    var options = {
        host: 'api.openweathermap.org',
        path: '/data/2.5/forecast?q=' + city + ',ru&APPID=' + _this.APP_ID + '&units=metric&lang=ru'
    };
    var res = '';
    var callback = function (response) {
        response.on('data', function (chunk) {
            res += chunk;
        });

        response.on('end', function () {
            var str = _this.parseResponse(res);
            botCallback(str)
        });
    };

    http.request(options, callback).end();
};

Weather.prototype.parseResponse = function (dataStr) {
    var data = JSON.parse(dataStr);
    var e = [];
    data.list.forEach(function (day) {
        var dateUtc = day.dt * 1000;
        var dateOrig = new Date(dateUtc);
        var date = dateFormat(dateOrig, "dd.mm.yyyy");
        var time = dateFormat(dateOrig, "HH:MM");
        var find = undefined;
        e.forEach(function (day) {
            if (day.date == date) {
                find = day;
            }
        });
        if (!find) {
            e.push({date: date, temps: [{time:time, temp:day.main.temp, date:dateOrig}]});
        } else {
            find.temps.push({time:time, temp:day.main.temp, date:dateOrig});
        }
    });
    var result = " Погода в Уфе:\n";
    e.forEach(function (day) {
        result += day.date + " | ";
        var temps = day.temps;
        if (temps.length <= 3 && temps.length > 0) {
            for (var i = 0; i < temps.length; i++) {
                result += temps[i].time + "  " + temps[i].temp + " | ";
            }
        } else if (temps.length >= 3) {
            result += temps[0].time + "  " + temps[0].temp + " | ";
            result += temps[Math.floor(temps.length/2)].time + "  " + temps[Math.floor(temps.length/2)].temp + " | ";
            result += temps[temps.length-1].time + "  " + temps[temps.length-1].temp + " | ";
        }
        result += "\n"
    });
    return result;
};

