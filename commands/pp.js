const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const PlayerManager = require("../managers/playerManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pp')
        .setDescription('Voir tes points de pouvoir (PP)'),
    
    async execute(interaction) {
        const discordId = interaction.user.id;
        const guildId = interaction.guild.id;

        const pp = await PlayerManager.getPP(discordId, guildId);
        if (pp === null) {
            await interaction.reply({
                content: '❌ Vous n\'êtes pas inscrit à cette partie. Utilisez /register pour vous inscrire.',
                flags: MessageFlags.Ephemeral
            });
            return;
        }
        await interaction.reply({
            content: `💥 Vous avez **${pp}** point(s) de pouvoir (PP).`,
            flags: MessageFlags.Ephemeral
        });
    }
}