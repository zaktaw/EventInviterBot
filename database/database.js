const User = require('./schema.js');
const mongoose = require('mongoose');
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
                console.log("user " + user.username + " does not exist")
                let userDocument = new User({ _id: user.id, username: user.username });

                userDocument.save()
                    .then(doc => console.log(`Sucessfully added user: ${doc}`))
            }

            // user exists
            else {
                msg.reply("You have already joined the event")
                    .then(msg.delete({ timeout: 5000 }))
            }
        })
}



module.exports = {
    initDB,
    addUser
}