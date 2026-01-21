const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("./ping");
const PlayerManager = require("../managers/playerManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('intercepter')
        .setDescription(`Intercepter une enquête`)
        .addUserOption(o => o
            .setName('joueur')
            .setDescription('Joueur à intercepter')
            .setRequired(true)
        ),

        async execute(interaction) {
            const guildId = interaction.guild.id;
            const actorId = interaction.user.id;
            const targetId = interaction.options.getUser('joueur').id;

            if (actorId === targetId) {
                await interaction.reply({
                    content: '❌ Vous ne pouvez pas vous intercepter vous-même.',
                    flags: MessageFlags.Ephemeral
                });
                return;
            }

            const actor = await PlayerManager.getPlayer(actorId, guildId);
            if (!actor || actor.pp < 3) {
                return interaction.reply({
                    content: '❌ PP insuffisants',
                    flags: MessageFlags.Ephemeral
                });
            }

            await PlayerManager.removePP(actorId, guildId, 3);
            await ActionManager.createAction(guildId, actorId, targetId, 'intercept')

            await interaction.reply({
                content: `🛡️ Vous avez intercepter <@${targetId}>. Le GM vous répondra en privé.`,
                flags: MessageFlags.Ephemeral
            });
        }
}