const Discord = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { getPlayersMatches, getPlayerTitle } = require('../../services/aoe2')

const { MessageEmbed, ActionRowBuilder, ButtonBuilder, ButtonStyle } = Discord

const usertotagmap = {}

module.exports = {
    name: "match",
    category: "Stats",
    aliases: ["match"],
    cooldown: 2,
    usage: "match <PROFILE_ID>",
    description: "Resends a message from you as an Embed",
    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     * @param {*} args 
     */
    run: async (client, message, args) => {
        const [profileId] = args
        message.channel.send(new MessageEmbed({ description: 'Fetching matches for ' + profileId }))
        const matches = await getPlayersMatches(profileId)
        if (!matches) {
            message.channel.send(new MessageEmbed({ description: 'Not matches found.' }));

            return
        }

        const reply = new MessageEmbed({
            title: 'Macthes for ' + profileId,
            fields: [
                { name: '1v1', value: matches['1v1'] ? matches['1v1'] : 'Not found' },
                { name: 'team', value: matches.team ? matches.team : 'Not found' }
            ]
        });

        message.channel.send(reply)

    }
}
/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
