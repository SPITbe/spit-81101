const fs = require('fs');
const path = require('path');

module.exports = (dexter) => {
    const eventsPath = path.join(__dirname, '../events');
    if (!fs.existsSync(eventsPath)) return;

    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`${eventsPath}/${file}`);

        if (!event.name || !event.execute) {
            console.warn(`⚠️ Événement invalide: ${file}`);
            continue;
        }

        if (event.once) {
            dexter.once(event.name, (...args) => event.execute(...args, dexter));
        } else {
            dexter.on(event.name, (...args) => event.execute(...args, dexter));
        }
    }

    console.log(`📥 ${eventFiles.length} événements chargés`);
}