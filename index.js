require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const ScheduleManager = require('./managers/scheduleManager');

const dexter = new Client({intents: [GatewayIntentBits.Guilds]})

//Handlers
require('./handlers/commandHandler')(dexter);
require('./handlers/eventHandler')(dexter);

setInterval(() => {
    ScheduleManager.runPendingDistributions().catch(err => console.error('Schedule Error:', err))
}, 30 * 1000)

dexter.login(process.env.TOKEN);