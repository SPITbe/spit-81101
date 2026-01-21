const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const PlayerManager = require("../managers/playerManager");
const ActionManager = require("../managers/actionManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('espionner')
        .setDescription('Espionner un joueur')
        .addUserOption(o => o 
            .setName('joueur')
            .setDescription('Le joueur à espionner')
            .setRequired(true)
        ),

        async execute(interaction) {
            const guildId = interaction.guild.id;
            const actorId = interaction.user.id;
            const targetId = interaction.options.getUser('joueur').id;

            if (actorId === targetId) {
                await interaction.reply({
                    content: '❌ Vous ne pouvez pas vous espionner vous-même.',
                    flags: MessageFlags.Ephemeral
                });
                return;
            }

            const actor = await PlayerManager.getPlayer(actorId, guildId);
            if (!actor || actor.pp < 2) {
                return interaction.reply({
                    content: '❌ PP insuffisants',
                    flags: MessageFlags.Ephemeral
                });
            }

            await PlayerManager.removePP(actorId, guildId, 2);
            await ActionManager.createAction(guildId, actorId, targetId, 'spy')

            await interaction.reply({
                content: `🕵️ Vous avez espionné <@${targetId}>. Le GM vous répondra en privé.`,
                flags: MessageFlags.Ephemeral
            });
        }
}