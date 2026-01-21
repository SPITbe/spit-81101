const pool = require('../database/db');
const ScheduleManager = require('./scheduleManager');

class GameManager {
    static async getActiveGame(guildId) {
        const [rows] = await pool.query(
            `SELECT * FROM games 
            WHERE guild_id = ? AND status = 'running'
            LIMIT 1`,
            [guildId]
        );
        return rows[0] || null;
    }

    static async startGame(guildId) {
        const active = await this.getActiveGame(guildId);
        if (active) return false;

        const [result] = await pool.query(
            `INSERT INTO games (guild_id, status, started_at)
            VALUES (?, 'running', NOW())`,
            [guildId]
        );

        const gameId = result.insertId
        await ScheduleManager.schedulePPDistribution(guildId, gameId);
        return true;
    }   
    
    static async stopGame(guildId) {
        const active = await this.getActiveGame(guildId);
        if (!active) return false;

        await pool.query(
            `UPDATE games 
            SET status = 'ended', ended_at = NOW()
            WHER id = ?`,
            [active.id]
        );
        return true;
    }
}

module.exports = GameManager;