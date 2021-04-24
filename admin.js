const Discord = require('discord.js');
const fs = require('fs'); 
const embedJson = require('./embed.json');
const config = require('./config.json');

// updates the guest list with the new user list
function updateEmbed(users, msg) {
    let usersString = String()
    if (users.length > 0) usersString += users[0].username
    for (let i=1; i<users.length; i++) usersString += "\n" + users[i].username
    
    let updatedEmbed = makeEmbed()
    updatedEmbed.addField(`Gjesteliste (${users.length})`, usersString.length > 0 ? usersString : "Ingen har blitt med på arrangementet enda")

    msg.channel.messages.fetch(config.embedID)
        .then(embed => embed.edit(updatedEmbed))
        .catch(err => console.error(err))
}

// create  a new embed from the information provided in the embed.json file
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

// send the created embed to a Discord channel
async function sendEmbed(msg) {
    let embed = makeEmbed();
    msg.channel.send(embed)
        .then(msg => {
            // update the embedID in the config file with the ID of the sent embed
            let configUpdated = config;
            configUpdated.embedID = msg.id;
            configUpdated = JSON.stringify(configUpdated);
            fs.writeFileSync('./config.json', configUpdated);
        });
}

// assigns the specified in the config role to the author of the message
function addRole(msg) {
    msg.guild.members.fetch(msg.author.id)
        .then(member => member.roles.add(config.roleID))
}

// unassigns the specified in the config role to the author of the message
function removeRole(msg) {
    msg.guild.members.fetch(msg.author.id)
        .then(member => member.roles.remove(config.roleID))
}

module.exports = {
    makeEmbed,
    updateEmbed,
    sendEmbed,
    addRole,
    removeRole
}