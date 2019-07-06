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

// Number of minutes to refresh server count after (recommended >= 1 min)
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
    // Check status every 4 minutes
    intervalId = client.setInterval(checkStatus, REFRESH_INTERVAL);
});


// Executes upon reception of message.
// States IPs of Minecraft servers respectively if '!ip' is typed into chat.
client.on('message', async msg => {
    if (msg.content === '!ip') {
        
        /**
         * Possible race condition. 
         * async/await evaluations are explicit through the 'AsyncFunction' and
         * 'PausableFunction' constructs within the V8 runtime.
         */

        await checkStatus(); 

        for (const name in servIP) {
            msg.reply(`${name}: ${servIP[ip]}`);
        }
    }
});

async function checkStatus() {

    // This logic is inherently flawed with what you had in mind.
    // If I iterate over 10 name:ip blocks, I have an unhandled
    // event emitter which needs to be closed to prevent memory
    // leaks. 

    for (const [name, ip] of Object.entries(servIP)) {
        
        // Dynamic runtime based memory leak. 
        /**
         * V8 has an optimizing compiler called TurboFan; it marks areas where
         * the code is "hot" or heavily used. When you use a 'require' call, it
         * can't optimize the block properly because of the inherent caching used
         * in the call. 
         *
         * You are better off requiring the module at the start of the file
         * and using it from thereon.
         */

        const [host, port] = ip.split(':'); // Splitting into ip and port

        serv.init(host, parseInt(port), () => {

            // You can get more explicit here and do 
            // Boolean(serv.online) or !!serv.online
            // the latter of which is not considered good
            // practice for readability.

            // Setting 'Activity' attribute of Discord bot with player counts of servers respectively.
            client.user.setActivity(`${statusStr}${name}: ${serv.online || 'nope'} | `);
        });

        // Probable memory leak. You are not clearing the timeout.
        // Async function pause
        await new Promise(done => setTimeout(done, 2500));
    }
}

// Set this in 'auth.json'
// Token can be found on your Discord developer portal.
client.login(auth.token);

// You might want to add a .on('closing') equivalent to clear the interval
// and the timeouts as well.
