const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');
const database = require('./database/database.js');
const admin = require('./admin.js');

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

    let args = msg.content.split(" ");

    // Prevent spam from bot
    if (msg.author.bot) return; // stops bot from replying to itself
    if (!msg.guild) return; // bot will only reply if message is sent in the guild (server)
    if (msg.channel.id != config.channelID) return; // bot will only reply in the channel with id identical to the channelID specified in the config file

    // Handle arguments given
    switch (args[0].toLowerCase()) {

        case 'test':
            msg.channel.send("EventInviterBot is working")
                .then(message => message.delete({ timeout: 5000 })); // delete message after 5 seconds
            msg.delete({ timeout: 5000 });
            break;

        case 'join':
            //admin.addRole(msg)
            database.addUser(msg);
            msg.delete({ timeout: 5000 });
            break;

        case 'unjoin':
            //admin.removeRole(msg)
            database.removeUser(msg)
            msg.delete({ timeout: 5000 })
            break;

        case 'embed':
            // Only admins can this command
            if (!msg.member.hasPermission('ADMINISTRATOR')) {
                msg.channel.send("You have to be an administrator to use this command")
                    .then(message => message.delete({ timeout:5000 }))
                msg.delete({ timeout: 5000 });
                return;
            }
         
            admin.sendEmbed(msg);
            msg.delete({ timeout: 5000 });
            break;

        case 'deleteall':
            // Only admins can this command
            if (!msg.member.hasPermission('ADMINISTRATOR')) {
                msg.channel.send("You have to be an administrator to use this command")
                    .then(message => message.delete({ timeout:5000 }));
                msg.delete({ timeout: 5000 })
                return;
            }

            database.deleteAll(msg)
            msg.delete({ timeout: 5000 })
            break;

            
        default :
            msg.channel.send(`"${args[0]}" is an invalid command.`)
                .then(message => message.delete({ timeout:5000 }))
            msg.delete({ timeout: 5000 })
    }   
});
