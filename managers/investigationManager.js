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

    static async runPendingResponses(client) {
        const [rows] = await pool.query(
            `SELECT * FROM pending_responses
            WHERE delivered = false AND execute_at <= NOW()`
        );

        for (const row of rows) {
            const action = await ActionManager.getPendingAction(
            row.guild_id,
            row.discord_id
            );

            try {
            const guild = await client.guilds.fetch(row.guild_id);
            const target = await guild.members.fetch(row.discord_id);

            // INTERCEPTION
            if (action && action.type === 'intercept') {
                await target.send(
                '🚨 **L’équipe d’enquête a disparu sans laisser de traces…**'
                );

                const interceptor = await guild.members.fetch(action.actor_id);

                setTimeout(async () => {
                await interceptor.send(
                    `📑 **Rapport intercepté (${row.keyword})** :\n${row.response_text}`
                );
                }, 5 * 60 * 1000);

                await ActionManager.consumeAction(action.id);
            }

            // ESPIONNAGE
            else {
                await target.send(
                `🕵️ **Résultat de ton enquête (${row.keyword})** :\n${row.response_text}`
                );

                if (action && action.type === 'spy') {
                const spy = await guild.members.fetch(action.actor_id);

                setTimeout(async () => {
                    await spy.send(
                    `🕶️ **Rapport espionné (${row.keyword})** :\n${row.response_text}`
                    );
                }, 5 * 60 * 1000);

                await ActionManager.consumeAction(action.id);
                }
            }

            await pool.query(
                `UPDATE pending_responses SET delivered = true WHERE id = ?`,
                [row.id]
            );

            } catch (err) {
            console.error('Erreur espion/interception:', err);
            }
        }
    }
}

module.exports = InvestigationManager;