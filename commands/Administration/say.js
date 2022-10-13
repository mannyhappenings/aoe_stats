const axios = require('axios')
const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");

const commonHeaders = {
    'accept': 'application/json, text/javascript, */*; q=0.01',
    'content-type': 'application/json',
    'authority': 'api.ageofempires.com',
}

async function getMPFull(profileId, matchType) {
    const res = await axios.post('https://api.ageofempires.com/api/v2/AgeII/GetMPFull', {
        profileId,
        matchType,
    }, { headers: commonHeaders });

    if (!res?.data?.user?.elo) {
        return null
    }

    return res.data
}

async function getMatchDetail(profileId, gameId, matchType) {
    const res = await axios.post('https://api.ageofempires.com/api/v2/AgeII/GetMPMatchDetail', {
        profileId,
        gameId
    }, { headers: commonHeaders });

    if (!res?.data?.matchSummary) {
        return {}
    }

    const data = res.data
    if (data.playerList) {
        for (const player of data.playerList) {
            Object.assign(player, { profile: await getMPFull(player.userId, matchType) })
        }
    }

    return data
}

/**
 * 
 * @param {*} profileId 
 * @param {*} matchType 
 * @returns {Promise<any[]>}
 */
async function getMatchList(profileId, matchType) {
    const res = await axios.post('https://api.ageofempires.com/api/v2/AgeII/GetMPMatchList', {
        profileId,
        sortColumn: "dateTime",
        matchType,
        count: 1
    }, { headers: commonHeaders });

    if (!res?.data?.matchList) {
        return null
    }
    const matchList = res.data.matchList
    for (let match of matchList) {
        const matchDetails = await getMatchDetail(profileId, match.gameId, matchType)
        Object.assign(match, matchDetails)
    }

    return matchList
}

function matchStats(match) {
    const elo = Math.round(match.playerList.map(player => player.profile?.user.elo ?? 0).reduce((a, b) => a + b) / match.playerList.length)
    return [
        `${match.dateTime.split('.')[0]}: ${match.mapType}${match.winLoss ? `(${match.winLoss})` : ''}: Avg Elo - ${elo}`,
        'Team 1: ' + match.playerList.filter(player => player.team == 0).map(player => `${player.profile?.user.userName}(${player.profile?.user.elo})`).join(', '),
        'Team 2: ' + match.playerList.filter(player => player.team == 1).map(player => `${player.profile?.user.userName}(${player.profile?.user.elo})`).join(', ')
    ].join('\n')
}

async function getPlayerStats(player, matchType) {
    const matchList = await getMatchList(player.rlUserId, matchType);
    const stats = matchList ? (await Promise.all(matchList)).map(match => matchStats(match)) : null;

    return [`\n${player.userName}(${player.userId}) -> (Elo: ${player.elo}) (Win Percent: ${player.winPercent}) (Win Streak: ${player.winStreak}) (Wins: ${player.wins})`].concat(
        'Games',
        matchList ? stats.join('\n') : []
    ).join('\n')
}

async function getPlayers(gamertag, matchType) {
    const res = await axios.post('https://api.ageofempires.com/api/v2/ageii/Leaderboard', {
        matchType,
        "searchPlayer": gamertag,
        "page": 1,
        "count": 3
    }, { headers: commonHeaders });

    if (!res?.data?.items) {
        return []
    } else {
        return res?.data?.items
    }
}

async function getPlayerMatches(gamertag) {

    const players1v1 = await getPlayers(gamertag, 3)
    const playersteam = await getPlayers(gamertag, 4)
    if (players1v1.length + playersteam.length === 0) {
        return null
    }
    const stats = []
    if (players1v1.length) {
        stats.push('1v1')
        for (const player of players1v1) {
            const stat = await getPlayerStats(player, 3)
            stats.push(stat);
        }
    }

    if (playersteam.length) {
        stats.push('\n\nTeam')
        for (const player of playersteam) {
            const stat = await getPlayerStats(player, 4)
            stats.push(stat);
        }
    }

    return stats
}

module.exports = {
    name: "say",
    category: "Administration",
    aliases: ["say"],
    cooldown: 2,
    usage: "say <TEXT>",
    description: "Resends your Text",
    run: async (client, message, args, user, text, prefix) => {
        console.log('say', text, args)
        try {
            if (!args[0])
                return message.channel.send(
                    new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`❌ ERROR | You didn't provided a Text`)
                        .setDescription(`Usage: \`${prefix}${this.usage}\``)
                );
            const elo = getPlayerMatches(text);

            message.channel.send(elo + '');
        } catch (e) {
            console.log(String(e.stack).bgRed);
            return message.channel.send(
                new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`❌ ERROR | An error occurred`)
                    .setDescription(`\`\`\`${e.stack}\`\`\``)
            );
        }
    },
    getPlayerMatches
};

/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
