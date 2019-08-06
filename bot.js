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

const Discord = require('discord.js');
const auth = require('./auth.json');
const serv = require('./minestat');

const client = new Discord.Client();

// Number of minutes to refresh server count after (recommended >= 1 min; default = 4)
const REFRESH_INTERVAL = 4 * 60 * 1000; // 4 minutes.

// IP and port of Minecraft servers
const servIP = {
    hypixel: 'mc.hypixel.net:25565',
};

let intervalId;

// Executes as long as bot is online.
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log('Ready...');
    checkStatus();

    // Check status every 4 minutes
    intervalId = client.setInterval(checkStatus, REFRESH_INTERVAL);
});


// Executes upon reception of message.
// States IPs of Minecraft servers respectively if '!ip' is typed into chat.
client.on('message', async msg => {
    if (msg.content === '!ip') {
        await checkStatus(); 
        // Building string output for '!ip' command
        for (const name in servIP) {
            msg.reply(`${name}: ${servIP[name]}`);
        }
    }
});

async function checkStatus() {
    let statusStr = '';

    for (const name in servIP) {

        const [host, port] = servIP[name].split(':'); // Splitting into ip and port
        serv.init(host, parseInt(port), () => {
            if (serv.online) {
                // Setting 'Activity' attribute of Discord bot with player counts of servers respectively.
                statusStr = (`${statusStr}${name}: ${serv.current_players} running ${serv.version} | `);
            }
            else {
                statusStr = (`${statusStr}${name}: nope | `);
            }
            client.user.setActivity(statusStr);
        });

        await new Promise(done => setTimeout(done, 5000));
    }
}

// Set this in 'auth.json'
// Token can be found on your Discord developer portal.
client.login(auth.token);
