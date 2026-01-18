const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const PlayerManager = require("../managers/playerManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription(`S'inscrire à la murder`),

        async execute(interaction) {
            const discordId = interaction.user.id;
            const guildId = interaction.guild.id;

            const existingPlayer = await PlayerManager.getPlayer(discordId, guildId);
            if (existingPlayer) {
                await interaction.reply({
                    content: '❌ Vous êtes déjà inscrit à cette partie',
                    flags: MessageFlags.Ephemeral
                });
                return;
            }

            await PlayerManager.registerPlayer(discordId, guildId);

            await interaction.reply({
                content: '✅ Vous êtes maintenant inscrit à la partie ! Vous commencez avec 4 PP.',
                flags: MessageFlags.Ephemeral
            });
        }
}