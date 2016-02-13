'use strict';

var SlackBot = require('../lib/slackbot');

var token = 'xoxb-21097528208-ho4EBu3GTIYutwVv9hSrO4mm';
var name = 'slackbot';

var slackbot = new SlackBot({
    token: token,
    name: name
});

slackbot.run();