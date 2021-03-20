const Discord = require('discord.js');
const bot = new Discord.Client();
const database = require('./database/database.js');
const admin = require('./admin.js');

const PREFIX = "ei "

bot.on('ready', () => {
    console.log("Bot is online!");
}); 

bot.on('rateLimit', (rateLimitInfo) => {
    console.log("RATE LIMIT REACHED:")
    console.log(rateLimitInfo)
});

bot.login(process.env.EVENT_INVITER_BOT_TOKEN);
database.initDB()

bot.on('message', (msg) => {

    let args = msg.content.substring(PREFIX.length).split(" ");

    // Prevent spam from bot
    if (msg.author.bot) return; // stops bot from replying to itself
    if (!msg.guild) return; // bot will only reply if message is sent in the guild (server)
    if (!msg.content.startsWith(PREFIX)) return; // bot will only reply if the message starts with the specified prefix

    // Handle arguments given
    switch (args[0].toLowerCase()) {

        case 'test':
            msg.channel.send("EventInviterBot is working")
                .then(message => message.delete({ timeout: 5000 })); // delete message after 5 seconds
            break;

        case 'join':
            database.addUser(msg);
            break;

        case 'unjoin':
            database.removeUser(msg)
            break;

        case 'embed':
            // Only admins can this command
            if (!msg.member.hasPermission('ADMINISTRATOR')) {
                msg.channel.send("You have to be an administrator to use this bot");
                return;
            }

         
            admin.sendEmbed(msg);
            msg.delete();
            break;
            
        default :
            msg.channel.send(`"${args[0]}" is an invalid command.`);
    }   
});
