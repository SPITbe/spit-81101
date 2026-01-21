const pool = require('../database/db');

class ActionManager {
    static async createAction(guildId, actorId, targetId, type) {
        await pool.query(
            `INSERT INTO pending_actions
            (guild_id, actor_id, target_id, type)
            VALUES (?, ?, ?, ?)`,
            [guildId, actorId, targetId, type]
        )
    }

    static async getPendingActions(guildId, targetId) {
        const [rows] = await pool.query(
            `SELECT * FROM pending_actions
            WHERE guild_id = ? AND target_id = ? AND consumed = false
            ORDER BY FIELD(type, 'intercept', 'spy')
            LIMIT 1`,
            [guildId, targetId]
        );
        return rows[0] || null;
    }
     
    static async consumeAction(id) {
        await pool.query(
            `UPDATE pending_actions SET consumed = true WHERE id = ?`,
            [id]
        )
    }
}

module.exports = ActionManager;