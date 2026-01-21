const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { execute } = require("./ping");
const GameManager = require("../managers/gameManager");
const PlayerManager = require("../managers/playerManager");
const KeywordManager = require("../managers/keywordManager");
const InvestigationManager = require("../managers/investigationManager");
const pp = require("./pp");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('enqueter')
        .setDescription('Mener une enquête')
        .addStringOption(o => o
            .setName('keyword')
            .setDescription('Mot-clé de l\'enquête')
            .setRequired(true)
        )
        .addIntegerOption(o => o
            .setName('pp')
            .setDescription('PP à dépenser')
            .setRequired(true)
            .setMinValue(1)
        ),

        async execute(interaction) {
            const guildId = interaction.guild.id;
            const discordId = interaction.user.id;

            const game = await GameManager.getActiveGame(guildId);
            if (!game) {
                return interaction.reply({
                    content: '❌ Aucune partie en cours',
                    flags: MessageFlags.Ephemeral
                })
            }

            const player = await PlayerManager.getPlayer(discordId, guildId);
            if (!player) {
                return interaction.reply({
                    content: '❌ Tu n\'es pas inscrit',
                    flags: MessageFlags.Ephemeral
                });
            }

            const ppSent = interaction.options.getInteger('pp');
            if (player.pp < ppSent) {
                return interaction.reply({
                    content: '❌ Tu n\'as pas assez de PP',
                    flags: MessageFlags.Ephemeral
                })
            }

            await PlayerManager.removePP(discordId, guildId, ppSent);

            const keywordInput = interaction.options.getString('keyword').toLowerCase();
            const keyword = await KeywordManager.getKeyword(guildId, keywordInput)

            if (!keyword) {
                await interaction.reply({
                    content: `❓Ce mot-clé est inconnu. Le GM va te répondre manuellement.`,
                    flags: MessageFlags.Ephemeral
                })
                return;
            }

            const dice = InvestigationManager.rollD6()
            const result = InvestigationManager.computeResult(dice, ppSent)

            const responseText = 
                result === 'fail' ? 
                    keyword.fail_text : 
                    result === 'success' ?
                        keyword.success_text :
                        keyword.perfect_text;

            const executeAt = new Date(
                Date.now() + keyword.delay_minutes * 60 * 1000
            )

            await InvestigationManager.createPendingResponse({
                guildId,
                discordId,
                keyword: keywordInput,
                result,
                text: responseText,
                executeAt
            })

            await interaction.reply({
                content: `🔎 Enquête lancée sur **${keywordInput}**. Résultat attendu dans ${keyword.delay_minutes} minutes.`,
                flags: MessageFlags.Ephemeral
            })
        }
}