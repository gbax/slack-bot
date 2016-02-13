'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');
var Weather = require('../lib/weather');


var SlackBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'slackbot';
    this.user = null;
};

util.inherits(SlackBot, Bot);

module.exports = SlackBot;

SlackBot.prototype.run = function () {
    SlackBot.super_.call(this, this.settings);
    this.on('start', this._onStart);
    this.on('message', this._onMessage);
    this.weather = new Weather({});
};

SlackBot.prototype._onStart = function () {
    this._loadBotUser();
};

SlackBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

SlackBot.prototype._onMessage = function (message) {
    console.log(message);
    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) &&
        !this._isFromSlackBot(message) &&
        this._isMentioningSlackBot(message)
    ) {
        this._replyWithWeather(message);
    } else if (this._isChatMessage(message) &&
        this._isChannelDirect(message) &&
        !this._isFromSlackBot(message) &&
        this._isMentioningSlackBot(message)) {
        this._replyToUser(message);
    }else if (this._isChatMessage(message) &&
        this._isChannelDirect(message) &&
        !this._isFromSlackBot(message) &&
        this._isCommandSendMessage(message)) {
        this._replyToUserCommand(message);
    }
};

SlackBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

SlackBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};

SlackBot.prototype._isChannelDirect = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'D';
};

SlackBot.prototype._isFromSlackBot = function (message) {
    return message.user === this.user.id || message.subtype == 'bot_message' || message.username == this.settings.name;
};

SlackBot.prototype._isMentioningSlackBot = function (message) {
    return message.text.toLowerCase().indexOf('погода в уфе') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};

SlackBot.prototype._isCommandSendMessage = function (message) {
    return message.text.toLowerCase().indexOf('послать темуру') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};

SlackBot.prototype._replyWithWeather = function (originalMessage) {
    var self = this;
    var channel = self._getChannelById(originalMessage.channel);
    var params = {
        icon_emoji: ':mount_fuji:'
    };
    this.weather.getWeather('Ufa', function(data) {
        self.postMessageToChannel(channel.name, data, params);
    });
};


SlackBot.prototype._replyToUser = function (originalMessage) {
    var self = this;
    var user = self._getUserById(originalMessage.user);
    var params = {
        icon_emoji: ':mount_fuji:'
    };
    this.weather.getWeather('Ufa', function(data) {
        self.postMessageToUser(user.name, data, params);
    });
};

SlackBot.prototype._replyToUserCommand = function (originalMessage) {
    var self = this;
    var channel = self._getChannelById('C0276CPH5');
    var params = {
        icon_emoji: ':mount_fuji:'
    };
    self.postMessageToChannel(channel.name, '@temurfatkulin Хуево в твоей деревне', params);
};

SlackBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

SlackBot.prototype._getUserById = function (channelId) {
    return this.users.filter(function (item) {
        return item.id === channelId;
    })[0];
};