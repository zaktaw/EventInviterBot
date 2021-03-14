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
                console.log("Adding " + user.username + " to the database")
                let userDocument = new User({ _id: user.id, username: user.username });

                userDocument.save()
                    .then(doc => {
                        console.log(`Sucessfully added user: ${doc}`)
                        User.find({}).lean()   
                            .then(users => admin.updateEmbed(users, msg))
                    });
            }

            // user exists
            else {
                msg.reply("You have already joined the event")
                    .then(msg.delete({ timeout: 5000 }))
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
                 console.log("Removing " + user.username + " from the database")
                 User.deleteOne({ _id: user.id })
                    .then(() => {
                        console.log("Successfully deleted " + user.username + " from the database")
                        User.find({}).lean()   
                            .then(users => admin.updateEmbed(users, msg))
                    })
                    .catch(err => console.log(err))
             }
 
             // user does not exist
             else {
                 msg.reply("You have already left the event")
                     .then(msg.delete({ timeout: 5000 }))
             }
         })
}
User.deleteOn


module.exports = {
    initDB,
    addUser,
    removeUser
}