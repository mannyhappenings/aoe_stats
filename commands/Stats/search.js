const Discord = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { getPlayersByTag, getPlayerTitle } = require('../../services/aoe2')

const { MessageEmbed, ActionRowBuilder, ButtonBuilder, ButtonStyle } = Discord

const usertotagmap = {}

module.exports = {
    name: "search",
    category: "Stats",
    aliases: ["search"],
    cooldown: 2,
    usage: "search <PLAYER_TAG>",
    description: "Resends a message from you as an Embed",
    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     * @param {*} args 
     */
    run: async (client, message, args) => {
        const [tag] = args
        const players = await getPlayersByTag(tag)

        if (!players) {
            message.channel.send(new MessageEmbed({ description: 'User not found.' }));

            return
        }
        const reply = new MessageEmbed().setTitle('AoeStats for ' + tag);

        if (players["1v1"]?.length)
            reply.addField('1v1', players["1v1"]?.map(player => getPlayerTitle(player)).join('\n'))

        if (players.team?.length)
            reply.addField('team', players["team"]?.map(player => getPlayerTitle(player)).join('\n'));

        message.channel.send(reply)

    }
}
/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
