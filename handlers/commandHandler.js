const { Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = (dexter) => {
    dexter.commands = new Collection()

    const commandsPath = path.join(__dirname, '../commands');
    if (!fs.existsSync(commandsPath)) return;

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`${commandsPath}/${file}`);
        if (!command.data || !command.execute) {
            console.warn(`⚠️ Commande invalide: ${file}`);
            continue;
        }
        dexter.commands.set(command.data.name, command);
    }

    console.log(`📦 ${dexter.commands.size} commandes chargées`)
};