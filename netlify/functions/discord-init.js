//Importing all needed Commands
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const colors = require("colors"); //this Package is used, to change the colors of our Console! (optional and doesnt effect performance)
const fs = require("fs");
require('dotenv/config'); //this package is for reading files and getting their inputs

//Creating the Discord.js Client for This Bot with some default settings ;) and with partials, so you can fetch OLD messages
const client = new Discord.Client({
    messageCacheLifetime: 60,
    fetchAllMembers: false,
    messageCacheMaxSize: 10,
    restTimeOffset: 0,
    restWsBridgetimeout: 100,
    disableEveryone: true,
    partials: ['MESSAGE', 'CHANNEL']
});

//Loading files, with the client variable like Command Handler, Event Handler, ...
require('../../events/guild/message')(client);

const token = process.env.BOT_TOKEN ?? require('./botconfig/config.json').token

//login into the bot
client.login(token);

/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
