const pool = require('../database/db');

class KeywordManager {
    static async getKeyword(guildId, keyword) {
        const [rows] = await pool.query(
            `SELECT * FROM keywords
            WHERE guild_id = ? AND keyword = ?
            LIMIT 1`,
            [guildId, keyword.toLowerCase()]
        );
        return rows[0] || null;
    }

    static async getAllKeywords(guildId) {
        const [rows] = await pool.query(
            `SELECT keyword, delay_minutes FROM keywords
            WHERE guild_id = ?`,
            [guildId]
        );
        return rows;
    }

    static async createKeyword(guildId, data) {
        await pool.query(
            `INSERT INTO keywords
            (guild_id, keyword, fail_text, success_text, perfect_text, delay_minutes)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                guildId,
                data.keyword.toLowerCase(),
                data.fail,
                data.success,
                data.perfect,
                data.delay
            ]
        )
    }

    static async updateKeyword(guildId, keyword, data) {
        await pool.query(
            `UPDATE keywords
            SET fail_text = ?, success_text = ?, perfect_text = ?, delay_minutes = ?
            WHERE guild_id = ? AND keyword = ?`,
            [
                data.fail,
                data.success,
                data.perfect,
                data.delay,
                guildId,
                keyword.toLowerCase()
            ]
        )
    }

    static async deleteKeyword(guildId, keyword) {
        await pool.query(
            `DELETE FROM keywords
            WHERE guild_id = ? AND keyword = ?`,
            [guildId, keyword.toLowerCase()]
        )
    }
}

module.exports = KeywordManager;