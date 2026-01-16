require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const dexter = new Client({intents: [GatewayIntentBits.Guilds]})

//Handlers
require('./handlers/commandHandler')(dexter);
require('./handlers/eventHandler')(dexter);

dexter.login(process.env.TOKEN);