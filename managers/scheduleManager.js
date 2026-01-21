const pool = require('../database/db');
const PlayerManager = require('./playerManager');

class ScheduleManager {
    static async schedulePPDistribution(guildId, gameId) {
        const now = new Date();
        for (let i = 1; i <= 3; i++) {
            const executeAt = new Date(now.getTime() + i * 60 * 60 * 1000);
            await pool.query(
                `INSERT INTO pp_distributions (guild_id, game_id, execute_at)
                VALUES (?, ?, ?)`,
                [guildId, gameId, executeAt]
            );
        }
    }

    static async runPendingDistributions() {
        const [rows] = await pool.query(
            `SELECT * FROM pp_distributions
            WHERE executed = FALSE AND execute_at <= NOW()`
        );
        for (const row of rows) {
            await PlayerManager.addPPToAll(row.guild_id, 4);

            await pool.query(
                `UPDATE pp_distributions SET executed = true WHERE id = ?`,
                [row.id]
            )

            console.log(`⏲️ PP distribués pour la guilde ${row.guild_id} du jeu ${row.game_id}`);
        }
    }
}

module.exports = ScheduleManager;