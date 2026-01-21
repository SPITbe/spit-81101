const { Events, MessageFlags } = require("discord.js")

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, dexter) {
        if (!interaction.isChatInputCommand()) return;

        const command = dexter.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction, dexter);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: '❌ Une erreur est survenue lors de l\'exécution de cette commande !',
                    flags: MessageFlags.Ephemeral
                })
            } else {
                await interaction.reply({
                    content: '❌ Une erreur est survenue lors de l\'exécution de cette commande !',
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
}