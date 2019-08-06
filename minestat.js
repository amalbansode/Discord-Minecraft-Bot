/*
 * minestat.js - A Minecraft server status checker
 * Copyright (C) 2016 Lloyd Dilley
 * http://www.dilley.me/
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

const net = require('net');

const NUM_FIELDS = 6;      // number of values expected from server
const DEFAULT_TIMEOUT = 5; // default TCP timeout in seconds

/*
 * You do not need these. this.<var_name> creates a new variable on the object.
 * address = null;
 * port = null;
 * online = null;             // online or offline?
 * version = null;            // server version
 * motd = null;               // message of the day
 * current_players = null;    // current number of players online
 * max_players = null;        // maximum player capacity
 * latency = null;            // ping time to server in milliseconds
 */

module.exports = {
    
    init(address, port, timeout, callback) {
        this.address = address;
        this.port = port;

        // if 3rd argument is a function, it's the callback (timeout is optional)
        // 'typeof' returns a string; you can directly compare it. 
        // A better/worse way (depending on how you think of it) is using
        // Function{}.length which returns the number of arguments of a function.
        if (typeof timeout === 'function') {
            callback = timeout;
            timeout = DEFAULT_TIMEOUT;
        }

        
        // Using 'const' and 'var' declarations together may cause problems with
        // scoping.
        const startTime = new Date();
        const client = net.connect(port, address, () => {
            this.latency = Math.round(new Date() - startTime);
            client.write(Buffer.from([ 0xFE, 0x01 ])); // Magic Numbers. Explain why you're using these.
        });

        client.setTimeout(timeout * 1000);

        client.on('data', data => {
            
            // '' and null are falsy types. You can use !data
            // but that won't prevent you from explicit undefined and pass-by-reference
            // null/undef checks.
            if (data) {

                // \x00 and \u0000 are null terminators. Specifiy that.
                // One in raw hex and the other in unicode points.
                const serverInfo = data.toString().split('\x00\x00\x00');
                if (serverInfo && serverInfo.length >= NUM_FIELDS) {
                    
                    this.online = true;
                    this.version = serverInfo[2].replace(/\u0000/g, '');
                    this.motd = serverInfo[3].replace(/\u0000/g, '');
                    this.current_players = serverInfo[4].replace(/\u0000/g, '');
                    this.max_players = serverInfo[5].replace(/\u0000/g, '');
                
                } else {
                    this.online = false;
                }
            }

            callback();
            client.end();

        });

        client.on('timeout', () => {
        
            client.end();
            callback();

            // It's always good to specify an exit code.
            process.exit(1);

        });

        // EOT (end of transmission) is important. You can do cleanups here after a cycle.
        client.on('end', () => {});

        client.on('error', err => {

            switch (err.code) {

                case 'ENOTFOUND': 
                    console.log(`Unable to resolve: %s.`, this.host);
                    break;
                case 'ECONNREFUSED':
                    console.log(`Unable to connect to %s:%s.`, this.host, this.port);

            }

            callback(err);

        });
    }
    
};
