const Discord = require('discord.js');
const fs = require('fs');
const config = require('../config.json');
const roleEmbeds = require('./roleEmbeds.json');
const roles = require('./roles.json');

const NOTIFY = '🔊'

function notifyRole(msg) {

    const embed = new Discord.MessageEmbed()
    .setColor(0xfcf003)
    .setTitle("Motta notifikasjoner")
    .setDescription(`Denne rollen gjør at du vil motta notifikasjoner før rulleringer skjer og før byen åpner. Trykk på ${NOTIFY}-ikonet på bunnen av meldingen for å få rollen. Trykk igjen for å fjerne rollen.`)
 
    msg.channel.send(embed)
        .then(msg => {
            msg.react(NOTIFY) // make the emoji appear on the embed

            // update the embedID in the roleEmbeds-file with the ID of the sent embed
            let roleEmbedsUpdated = roleEmbeds;
            roleEmbedsUpdated.notifyEmbedId = msg.id;
            roleEmbedsUpdated = JSON.stringify(roleEmbedsUpdated);
            fs.writeFileSync('./roleAssigning/roleEmbeds.json', roleEmbedsUpdated);
        })
        
}

async function initCollectors(bot)  {
    let channel = await bot.channels.fetch(config.RolesChannelID);

    // Notify
    channel.messages.fetch(roleEmbeds.notifyEmbedId)
    .then((msg) => {

        // only react to the specified emojes
        const filter = (reaction) => reaction.emoji.name === NOTIFY;

        const collector = msg.createReactionCollector(filter, { dispose: true }); // dispose = true enables users to remove their votes by clicking on the emoji again
        
        // assign roles
        collector.on('collect', (r, user) => {
            if (r.emoji.name == NOTIFY) {
             
                msg.guild.members.fetch(user.id)
                    .then((guildMember) => {
                        guildMember.roles.add(roles.notify)
                        .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
                    
            }
        });

        // unassign roles
        collector.on('remove', (r, user) => {
            if (r.emoji.name == NOTIFY) {
                msg.guild.members.fetch(user.id)
                    .then((guildMember) => {
                        guildMember.roles.remove(roles.notify)
                        .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
            }

        });
    })

}
        
module.exports = {
    notifyRole,
    initCollectors
}