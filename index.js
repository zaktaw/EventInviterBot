const Discord = require('discord.js');
const config = require('./testingConfig.json');
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log("Bot is online!");
}); 

bot.on('rateLimit', (rateLimitInfo) => {
    console.log("RATE LIMIT REACHED:")
    console.log(rateLimitInfo)
});

bot.login(config.token);

bot.on('message', (msg) => {

    let args = msg.content.substring(config.prefix.length).split(" ");

    // Prevent spam from bot
    if (msg.author.bot) return; // stops bot from replying to itself
    if (!msg.guild) return; // bot will only reply if message is sent in the guild (server)
    if (!msg.content.startsWith(config.prefix)) return; // bot will only reply if the message starts with the specified prefix

    // Only admins can use the bot
    if (!msg.member.hasPermission('ADMINISTRATOR')) {
        msg.channel.send("You have to be an administrator to use this bot");
        return;
    }

    // Handle arguments given
    switch (args[0].toLowerCase()) {

        case 'test':
            msg.channel.send("EventInviterBot is working")
                .then(message => message.delete({ timeout: 5000 })); // delete message after 5 seconds
            break;
            
        default :
            msg.channel.send(`"${args[0]}" is an invalid command.`);
    }   
});
