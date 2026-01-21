const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const GameManager = require("../managers/gameManager");
const SummaryManager = require("../managers/summaryManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('game')
        .setDescription('Gestion de la partie (GM)')
        .addSubcommand(sub => 
            sub.setName('start')
               .setDescription('Démarrer la partie')
        )
        .addSubcommand(sub =>
            sub.setName('stop')
               .setDescription('Arrêter la partie')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const sub = interaction.options.getSubcommand();

        if (sub === 'start') {
            const started = await GameManager.startGame(guildId);
            if (!started) {
                return interaction.reply({content: '❌ Une partie est déjà en cours dans ce serveur.', flags: MessageFlags.Ephemeral});
            }
            return interaction.reply({content: '✅ La partie a été démarrée ! Que le jeu commence ! 🔪'});
        }

        if (sub === 'stop') {
            const stopped = await GameManager.stopGame(guildId);
            if (!stopped) {
                return interaction.reply({content: '❌ Aucune partie en cours à arrêter dans ce serveur.', flags: MessageFlags.Ephemeral});
            }
            await interaction.reply({content: '✅ La partie a été arrêtée ! Merci d\'avoir joué ! 🎉'});
            const summary = await SummaryManager.generate(guildId)
            await interaction.channel.send(summary)
        }
    }
}