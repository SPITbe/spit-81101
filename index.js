require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const ScheduleManager = require('./managers/scheduleManager');
const InvestigationManager = require('./managers/investigationManager');
const { initDB } = require('./database/init');

const dexter = new Client({intents: [GatewayIntentBits.Guilds]})

//Handlers
require('./handlers/commandHandler')(dexter);
require('./handlers/eventHandler')(dexter);

//Managers
setInterval(() => {
    ScheduleManager.runPendingDistributions().catch(err => console.error('Schedule Error:', err))
    InvestigationManager.runPendingResponses(dexter).catch(err => console.error('Pending response error:', err))
}, 30 * 1000)

dexter.login(process.env.TOKEN);