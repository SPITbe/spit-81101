const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const KeywordManager = require("../managers/keywordManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('keyword')
        .setDescription('Gestion des keywords (GM)')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand(sub => sub 
            .setName('add')
            .setDescription('Ajouter un keyword')
            .addStringOption(o => o
                .setName('keyword')
                .setDescription('Mot-clé')
                .setRequired(true)
            )
            .addIntegerOption(o => o
                .setName('delai')
                .setDescription('Délai en minutes (5, 10, 15)')
                .setRequired(true)
                .addChoices(
                    { name: '5 minutes', value: 5 },
                    { name: '10 minutes', value: 10 },
                    { name: '15 minutes', value: 15 }
                )
            )
            .addStringOption(o => o
                .setName('ratee')
                .setDescription('Réponse enquête ratée')
                .setRequired(true)
            )
            .addStringOption(o => o
                .setName('reussie')
                .setDescription('Réponse enquête réussie')
                .setRequired(true)
            )
            .addStringOption(o => o
                .setName('parfaite')
                .setDescription('Réponse enquête parfaite')
                .setRequired(true)
            )
        )
        .addSubcommand(sub => sub
            .setName('delete')
            .setDescription('Supprimer un keyword')
            .addStringOption(o => o
                .setName('keyword')
                .setDescription('Mot-clé')
                .setRequired(true)
            )
        )
        .addSubcommand(sub => sub
            .setName('list')
            .setDescription('Lister les keywords')
        ),

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const sub = interaction.options.getSubcommand()

        if (sub === 'add') {
            const data = {
                keyword: interaction.options.getString('keyword'),
                delay: interaction.options.getInteger('delai'),
                fail: interaction.options.getString('ratee'),
                success: interaction.options.getString('reussie'),
                perfect: interaction.options.getString('parfaite')
            }

            const exists = await KeywordManager.getKeyword(guildId, data.keyword);
            if (exists) {
                return interaction.reply({
                    content: `❌ Le keyword \`${data.keyword}\` existe déjà.`,
                    flags: MessageFlags.Ephemeral
                })
            }

            await KeywordManager.createKeyword(guildId, data);

            return interaction.reply({
                content: `🧩 Keyword **${data.keyword}** créé avec succès.`
            })
        }

        if (sub === 'delete') {
            const keyword = interaction.options.getString('keyword');

            await KeywordManager.deleteKeyword(guildId, keyword);

            return interaction.reply({
                content: `🗑️ Keyword **${keyword}** supprimé avec succès.`
            })
        }

        if (sub === 'list') {
            const keywords = await KeywordManager.getAllKeywords(guildId);
            if (keywords.length === 0) {
                return interaction.reply({
                    content: `ℹ️ Aucun keyword enregistré.`,
                    flags: MessageFlags.Ephemeral
                })
            }

            const list = keywords
                .map(k => `• \`${k.keyword}\` - Délai : ${k.delay_minutes} minutes`)
                .join('\n');

            return interaction.reply({
                content: `📋 **Keywords**\n${list}`,
                flags: MessageFlags.Ephemeral
            })
        }
    }
}