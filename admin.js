const Discord = require('discord.js');
const fs = require('fs'); 
const embedJson = require('./embed.json');
const config = require('./config.json');

// updates the guest list with the new user list
function updateEmbed(users, msg) {
    let usersString = String()
    if (users.length > 0) usersString += users[0].username
    for (let i=1; i<users.length; i++) usersString += ", " + users[i].username
    
    let updatedEmbed = makeEmbed()
    updatedEmbed.addField(`Guest list (${users.length})`, usersString.length > 0 ? usersString : "No one has joined the event yet")

    msg.channel.messages.fetch(embedJson.id)
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
            // update the embedID in the embed.json file with the ID of the sent embed
            let embedID_json_file = embedJson;
            embedID_json_file.id = msg.id;
            embedID_json_file = JSON.stringify(embedID_json_file);
            fs.writeFileSync('./embed.json', embedID_json_file);
        });
}

function addRole(msg) {
    // let guild = await bot.guilds.fetch(config.serverID)
    // let member = await guild.members.fetch(msg.author.id)
    msg.guild.members.fetch(msg.author.id)
        .then(member => member.roles.add(config.roleID))
}

function removeRole(msg) {
    // let guild = await bot.guilds.fetch(config.serverID)
    // let member = await guild.members.fetch(msg.author.id)
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