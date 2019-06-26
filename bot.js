/*  
 * MinecraftDiscordBot.js — A script to power a Discord bot that checks 
 * the status of specified Minecraft servers.
 * Copyright (C) 2019 Amal Bansode
 * http://amalbansode.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// Use with Node.js
// Requires discord.js, minestat.js (https://github.com/ldilley/minestat)

const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

// Number of minutes to refresh server count after (recommended >= 1 min)
var refreshEvery = 4;
var refreshDelay = refreshEvery * 60000;

// IP and port of Minecraft servers
var servIP = {
    'hypixel': 'mc.hypixel.net:25565',
    // 'your title': 'your.ip:port',
};

// Executes as long as bot is online.
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log('Ready...');
    // Check status every 4 minutes
    client.setInterval(checkStatus, refreshDelay);
});


// Executes upon reception of message.
// States IPs of Minecraft servers respectively if '!ip' is typed into chat.
client.on('message', async msg => {
    if (msg.content === '!ip') {
        checkStatus();
        for (var key in servIP) {
            msg.reply(key + ': ' + servIP[key]);
        }
    }
});

async function checkStatus() {
    var statusStr = '';

    for (var key in servIP) {
        var online = 'nope'; // fallback
        var pieces = servIP[key].split(':'); // Splitting into ip and port

        var serv = require('./minestat');
        serv.init(pieces[0], parseInt(pieces[1]), function(result) {
            if (serv.online) {
                online = serv.current_players;
            } else {
                online = 'nope';
            }
            // Appends player count of server being tested to status string.
            statusStr = statusStr.concat(key + ': ' + online + ' | ');
            // Setting 'Activity' attribute of Discord bot with player counts of servers respectively. 
            client.user.setActivity(statusStr);
        });
        // Async function pause
        await new Promise(done => setTimeout(done, 2500));
    }
}

// Set this in 'auth.json'
// Token can be found on your Discord developer portal.
client.login(auth.token);
