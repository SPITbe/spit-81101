const pool = require('../database/db');

class PlayerManager {
    static async getPlayer(discordId, guildId) {
        const [rows] = await pool.query(
            'SELECT * FROM players WHERE discord_id = ? AND guild_id = ?',
            [discordId, guildId]
        );
        return rows[0] || null;
    }

    static async registerPlayer(discordId, guildId) {
        const [result] = await pool.query(
            `INSERT INTO players (discord_id, guild_id, pp)
            VALUES (?, ?, 4)`,
            [discordId, guildId]
        )
        return result.insertId;
    }

    static async getPP(discordId, guildId) {
        const player = await this.getPlayer(discordId, guildId);
        return player ? player.pp : null;
    }

    static async addPP(discordId, guildId, amount) {
        await pool.query(
            `UPDATE players SET pp = pp + ? WHERE discord_id = ? AND guild_id = ?`,
            [amount, discordId, guildId]
        )
    }

    static async removePP(discordId, guildId, amount) {
        await pool.query(
            `UPDATE players SET pp = pp - ? WHERE discord_id = ? AND guild_id = ?`,
            [amount, discordId, guildId]
        )
    }
}

module.exports = PlayerManager;