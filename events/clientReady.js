const { Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(dexter) {
         console.log(`🔪 ${dexter.user.tag} est prêt à faire une tuerie !`);
    },
}