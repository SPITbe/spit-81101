const pool = require('../database/db');

class InvestigationManager {
    static rollD6() {
        return Math.floor(Math.random() * 6) + 1;
    }

    static computeResult(dice, ppSpent) {
        if (dice === 1) return 'fail';

        const total = dice + ppSpent - 1
        if (total >= 6) return 'perfect';
        return 'success'
    }

    static async createPendingResponse(data) {
        await pool.query(
            `INSERT INTO pending_responses
            (guild_id, discord_id, keyword, result, response_text, execute_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.guildId,
                data.discordId,
                data.keyword,
                data.result,
                data.text,
                data.executeAt
            ]
        )
    }

    static async runPendingResponses(dexter) {
        const [rows] = await pool.query(
            `SELECT * FROM pending_responses
            WHERE delivered = false AND execute_at <= NOW()`
        )

        for (const row of rows) {
            try {
                const guild = await dexter.guilds.fetch(row.guild_id);
                const member = await guild.members.fetch(row.discord_id);
                await member.send(`🔔 Résultat de votre enquête pour le mot-clé **${row.keyword}** :\n\n${row.response_text}`);

                await pool.query(
                    `UPDATE pending_responses SET delivered = true WHERE id = ?`,
                    [row.id]
                )
            } catch (err) {
                console.error(`Erreur envoi enquête: `, err)
            }
        }
    }
}

module.exports = InvestigationManager;