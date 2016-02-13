'use strict';

var SlackBot = require('../lib/slackbot');

var token = process.env.BOT_API_KEY;
var tokenWeather  = process.env.WEATHER_API_KEY;

var name = 'slackbot';

var slackbot = new SlackBot({
    token: token,
    name: name,
    tokenWeather: tokenWeather
});

slackbot.run();