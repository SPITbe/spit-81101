const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const PlayerManager = require("../managers/playerManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ppadmin')
        .setDescription('Gestion des PP (GM)')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(sub => sub
            .setName('list')
            .setDescription('Voir les PP de tous les joueurs')
        )
        .addSubcommand(sub => sub
            .setName('add')
            .setDescription('Ajouter des PP à un joueur')
            .addUserOption(o => o
                .setName('joueur')
                .setDescription('Joueur')
                .setRequired(true))
            .addIntegerOption(o => o
                .setName('pp')
                .setDescription('Nombre de PP à ajouter')
                .setRequired(true)
            )
        )
        .addSubcommand(sub => sub
            .setName('remove')
            .setDescription('Retirer des PP à un joueur')
            .addUserOption(o => o
                .setName('joueur')
                .setDescription('Joueur')
                .setRequired(true))
            .addIntegerOption(o => o
                .setName('pp')
                .setDescription('Nombre de PP à retirer')
                .setRequired(true)
            )
        ),

        async execute(interaction) {
            const guildId = interaction.guild.id;
            const sub = interaction.options.getSubcommand()

            if (sub === 'list') {
                const players = await PlayerManager.getAllPlayers(guildId)
                if (players.length === 0) {
                    await interaction.reply({
                        content: 'ℹ️ Aucun joueur inscrit à cette partie.',
                        flags: MessageFlags.Ephemeral});
                    return;
                }

                const list = players
                    .map(p => `<@${p.discord_id}> : **${p.pp}** PP`)
                    .join('\n');
                
                return interaction.reply({
                    content: `💥 **Points de Pouvoir (PP) des joueurs :**\n\n${list}`,
                    flags: MessageFlags.Ephemeral
                });
            }

            const targetId = interaction.options.getUser('joueur').id;
            const amount = interaction.options.getInteger('pp');

            if (sub === 'add') {
                await PlayerManager.addPP(targetId, guildId, amount);
                return interaction.reply({
                    content: `➕ Ajout de **${amount}** PP à <@${targetId}>.`,
                    flags: MessageFlags.Ephemeral
                });
            }
            if (sub === 'remove') {
                await PlayerManager.removePP(targetId, guildId, amount);
                return interaction.reply({
                    content: `➖ Retrait de **${amount}** PP à <@${targetId}>.`,
                    flags: MessageFlags.Ephemeral
                });
            }
        }
}