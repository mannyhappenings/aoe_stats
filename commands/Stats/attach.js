const Discord = require("discord.js");
const fs = require("fs")
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { getPlayersByTag, getPlayerTitle } = require('../../services/aoe2')

const { MessageEmbed, ActionRowBuilder, ButtonBuilder, ButtonStyle } = Discord

const usertotagmap = {}

function loadTags() {
    const file = fs.readFileSync('usertotagmap.txt').toString();
    file.split('\n').map(row => row.split(':-:-:')).forEach(([user, profileId]) => {
        usertotagmap[user] = profileId;
    });
}

// loadTags();

module.exports = {
    name: "attach",
    category: "Stats",
    aliases: ["search"],
    cooldown: 2,
    usage: "attach <PLAYER_TAG> <PROFILE_ID>",
    description: "Resends a message from you as an Embed",
    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     * @param {*} args 
     */
    run: async (client, message, args) => {
        console.log('message', message, args)
        const [tag, profileId] = args


        message.channel.send(reply)

    }
}
/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
