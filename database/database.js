const User = require('./schema.js');
const mongoose = require('mongoose');
const admin = require('../admin.js');
mongoose.connect('mongodb://localhost:27017/EventInviteBot', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

function initDB() {
  db.on('error', console.error.bind(console, 'Connection error'));
  db.once('open', function() {
    console.log('Database is connected');
  });
}

async function addUser(msg) {
    // find user in database
    let user = msg.author;
    await User.findById({ _id: user.id })
        .then(doc => {

            // user does not exist: add user
            if (!doc) {
                
                let userDocument = new User({ _id: user.id, username: user.username });

                userDocument.save()
                    .then(() => {
                        console.log(`Sucessfully added user: ${user.username}`)

                        // get all users and update embed
                        User.find({}).lean()   
                            .then(users => admin.updateEmbed(users, msg))
                    });
            }

            // user exists
            else {
                msg.reply("You have already joined the event")
                    .then(message => message.delete({ timeout: 5000 }))
            }
        })
}

async function removeUser(msg) {
     // find user in database
     let user = msg.author;
     await User.findById({ _id: user.id })
         .then(doc => {
 
             // user exists: remove user
             if (doc) {
                 User.deleteOne({ _id: user.id })
                    .then(() => {
                        console.log("Successfully deleted user: " + user.username)

                        // get all users and update embed
                        User.find({}).lean()   
                            .then(users => admin.updateEmbed(users, msg)) 
                    })
                    .catch(err => console.log(err))
             }
 
             // user does not exist
             else {
                 msg.reply("You have already left the event")
                     .then(message => message.delete({ timeout: 5000 }))
             }
         })
}

// deletes all items in the database
async function deleteAll(msg) {
    User.deleteMany({}) // {} = all documents
        .then(() => {
            console.log("Successfully deleted all users")
            msg.channel.send("Successfully deleted all users")
                .then(message => message.delete({ timeout: 5000 }))

            // get all users and update embed
            User.find({}).lean() 
                .then(users => admin.updateEmbed(users, msg))
        })
        .catch(err => {
            console.error(err)
            msg.channel.send("Error: unable to delete all users")
        });
}

module.exports = {
    initDB,
    addUser,
    removeUser,
    deleteAll
}