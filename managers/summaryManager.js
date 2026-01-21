const pool = require('../database/db');

class SummaryManager {
  static async generate(guildId) {
    const [[game]] = await pool.query(
      `SELECT * FROM games
       WHERE guild_id = ? AND status = 'ended'
       ORDER BY ended_at DESC LIMIT 1`,
      [guildId]
    );

    const [players] = await pool.query(
      `SELECT discord_id, pp FROM players WHERE guild_id = ?`,
      [guildId]
    );

    const [investigations] = await pool.query(
      `SELECT COUNT(*) AS total FROM investigations WHERE guild_id = ?`,
      [guildId]
    );

    let text = `🏁 **Résumé de la partie**\n`;
    text += `⏱️ Durée : ${
      game.started_at && game.ended_at
        ? Math.round((new Date(game.ended_at) - new Date(game.started_at)) / 60000)
        : '?'
    } minutes\n\n`;

    text += `👥 **Joueurs & PP finaux :**\n`;
    for (const p of players) {
      text += `• <@${p.discord_id}> : ${p.pp} PP\n`;
    }

    text += `\n🔎 Enquêtes totales : ${investigations[0].total}`;

    return text;
  }
}

module.exports = SummaryManager;
