# Discord Minecraft Bot


## Introduction
This is a Node.js script for a Discord bot. Based on [MineStat](https://github.com/ldilley/minestat), the bot checks the status of user-specified Minecraft servers and returns the number of players online.

## Installation
This requires Node.js to be installed on your system, along with primary dependencies discord.js and minestat.js.

### Setting up for use with Node.js
1. Install Node.js and npm on your system. (You can use [nvm](https://github.com/nvm-sh/nvm) or the [Node.js](https://nodejs.org/en/download/) binary.)
2. Clone this repository and place it in a folder. (Use `git clone https://github.com/amalbansode/Minecraft-Discord-Bot`)
2. In terminal, navigate to this folder.
	```bash
	$ cd location/of/your/Minecraft-Discord-Bot
	```
3. Install the latest `discord.js` using npm.
	```bash
	$ npm i -S discord.js # You can remove the -S because npm now automatically saves it to package.json
	```

### Setting up a Discord Application
1. [Create a Discord Application](https://discordapp.com/developers/applications/) for the purpose of this bot. Setup a Discord account if you do not have one yet.
2. Give the application/bot a name and description.
3. Navigate to the ‘Bot’ section. Reveal your bot’s token, and copy it.
4. Open `auth.json`, which is contained in the same folder as `bot.js`.
5. Paste your token within the double quotes corresponding to the "token" key, and save `auth.json`.
6. Now, with Terminal open in the same directory as before, run
	```bash
	$ node bot.js
	```
7. The output should say the following. If so, you have setup the bot correctly.
	```
	Logged in as <your bot’s discord tag>!
	Ready...
	```
8. Exit the application using a keyboard escape (typically `control/command + C`).

### Adding the bot to a server
1. On the [Dicord Chat Client](https://discordapp.com/channels/), click the '+' icon on the left side and create a new server for testing the bot. Skip this step if you manage a pre-existing server you want the bot to be added to.
2. On the Discord Develper Portal for your bot, navigate to the section titled ‘OAuth2’. Scroll down to view the OAuth2 URL Generator.
3. Check the following boxes: 
	* In Scopes, _bot_
	* In Bot Permissions, _Send Messages_ and _Read Message History_
4. A URL must have been generated above. Follow this URL in a new browser tab.
5. Specify the server you would like to add the bot to (this could be the one you created in step 1, or a pre-existing server).
6. Verify the permissions stated, and click ‘Authorize’.
7. The bot should now be a member of your specified server.
8. Start the bot in Terminal again
	```bash
	$ node bot.js
	```
9. In the Discord chat window for this server, enter ‘!ip’ and check for output in your Discord chat.

## Features

### Player count display
The number of players on the server is displayed as the bot’s activity in the ‘Users‘ list on the right side.

![Discord Bot Activity shows player count](/images/discord_activity.png)

### Printing the list of server IPs in chat
The IP details of servers can be displayed in Discord chat by typing `!ip` into Discord chat. The bot will reply to the user invoking the command.

![Discord Bot replies with list of IPs to servers](/images/discord_reply.png)

## Configuration

### Changing the servers to be checked
1. Stop the bot if it is running. Open `bot.js` in a text-editing program.
2. Navigate to line _33_, which contains the dictionary type variable `servIP`.
3. By default, the dictionary contains the IP Address for the MInecraft Hypixel server.
	```javascript
	const servIP = {
	    hypixel: 'mc.hypixel.net:25565',
	    // 'your title': 'your.ip:port',
	};
	```
4. Modify this dictionary to follow the template, keeping the title(s) and IP Address(es) within single quotation (') marks, separated by a colon (:) mark. The order of servers in this dictionary list will be preserved in the bot’s output.

### Changing the frequency of checking servers' status
1. By default, the bot checks the status of servers every four minutes.
2. To modify this, change the variable `refreshEvery` on line _29_ to the number of minutes between every refresh. Use a floating point numeral if required.

Note: The bot being asynchronous, however, will require at least `the number of servers times 2.5` seconds to fetch the statuses of all servers at once. This time interval can be reduced, but it is suggested that this remain as it is to prevent any malfunctioning.

## FAQs
**There's no port specified for my Minecraft server**

The standard port for Minecraft servers is typically _25565_.

**Does the bot run forever?**

No, the bot goes offline when you close Terminal or end the process on your system. You could host the bot on AWS or Heroku, following the same steps as above, instead. The bot can be kept online using the _forever_ module. Check out [this guide](https://shiffman.net/a2z/bot-ec2/) on the usage of AWS.

## Contributors

Contributions and improvements to the project are welcome! The following users helped by reviewing code and fixing my silly errors:

* [Shreyas Minocha](https://github.com/shreyasminocha)
* [Shreyansh Pandey](https://github.com/labsvisual)

## License
<!--
GPL v3 is not a very permissive license. You may be better off with 
MIT or ISC license. Check it out! :)
-->
GNU GPL v3 or later

© Amal Bansode, 2019
