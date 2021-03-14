const Discord = require('discord.js');
const embedJson = require('./embed.json');

let embedId;

function updateEmbed(users, msg) {
    usersString = String()
    usersString= users[0].username
    for (let i=1; i<users.length; i++) usersString += ", " + users[i].username
    
    let updatedEmbed = makeEmbed()
    updatedEmbed.addField(`Guest list (${users.length})`, usersString)

    msg.channel.messages.fetch(embedId)
        .then(embed => embed.edit(updatedEmbed))
}

function makeEmbed() {
    let embed = new Discord.MessageEmbed()

    if (embedJson.hasOwnProperty("title")) embed.setTitle(embedJson.title)
    if (embedJson.hasOwnProperty("description")) embed.setDescription(embedJson.description)
    if (embedJson.hasOwnProperty("color")) embed.setColor(Number(embedJson.color))
    if (embedJson.hasOwnProperty("fields")) {
        embedJson.fields.forEach(field => {
            embed.addField(field.header, field.body) 
        });
    }

   return embed;
}

function sendEmbed(msg) {
    let embed = makeEmbed();
    msg.channel.send(embed)
        .then(msg => embedId = msg.id)
}

module.exports = {
    makeEmbed,
    updateEmbed,
    sendEmbed
}