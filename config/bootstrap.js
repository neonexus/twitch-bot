const tmi = require('tmi.js');

/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function(){

    // Create a client with our options
    const client = new tmi.client({
        connection: {
            secure: true,
            reconnect: true
        },
        identity: {
            username: sails.config.twitch.bot_username,
            password: sails.config.twitch.oAuth
        },
        channels: [
            sails.config.twitch.channel
        ]
    });

    // Called every time a message comes in
    function onMessageHandler(channel, userState, msg, self){
        if (self) {
            return;
        } // Ignore messages from the bot

        // Handle different message types..
        switch (userState['message-type']) {
            case 'action':
                // This is an action message..
                break;
            case 'chat':
                // This is a chat message..

                // check if we have our command trigger
                if (msg.trim() === '' || msg.trim().substr(0, 1) !== '!') {
                    return;
                }

                // Remove whitespace from chat message
                const messageBits = msg.trim().split(' '),
                    commandName = messageBits[0].substr(1);

                // If the command is known, let's execute it
                if (commandName === 'dice') {
                    const num = roll(!isNaN(messageBits[1]) ? messageBits[1] : undefined);
                    client.say(channel, `You rolled a ${num}`);
                } else if (commandName === 'countdown') {
                    const start = 4;

                    for (let i = start; i >= 0; --i) {
                        setTimeout(() => {
                            let say = `${i}`;

                            if (i === 0) {
                                say = 'Earth below us, drifting, falling...';
                            }

                            client.say(channel, `${say}`);
                        }, 1000 * ((start + 1) - i));
                    }
                } else {
                    console.log(`* Unknown command ${commandName}`);
                }

                break;
            case 'whisper':
                // This is a whisper..
                client.whisper(userState.username, `Sorry, I don't like whispering.`);
                break;
            default:
                // Something else ?
                break;
        }
    }

    // Function called when the "dice" command is issued
    function roll(sides = 6){
        return Math.floor(Math.random() * sides) + 1;
    }

    // Called every time the bot connects to Twitch chat
    function onConnectedHandler(addr, port){
        console.error(`* Connected to ${addr}:${port}`);
    }

    // DOOM
    function onDisconnectedHandler(reason){
        console.error('DISCONNECTED: ' + reason);
    }

    // Called when someone sends cheer
    function onCheerHandler(channel, userState, message){

    }

    client.on('message', onMessageHandler);
    client.on('connected', onConnectedHandler);
    client.on('disconnected', onDisconnectedHandler);
    client.on('cheer', onCheerHandler);

    // Connect to Twitch
    client.connect();
};

