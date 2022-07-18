const { sequelize } = require("../database");
const { Op, QueryTypes } = require("sequelize");
const { client } = require("../client");

const DAILY = "daily";
const WEEKLY = "weekly";

async function manageReminders() {
  Date.prototype.addDays = function (days) {
    let date = new Date(this.valueOf());
    date.setUTCDate(date.getUTCDate() + days);
    return date;
  };
  const now = new Date();

  const currentDay = `${now.getUTCDay()}`;
  const currentTime = now.toUTCString().slice(17, 22);
  const reminders = await sequelize.query(
    `SELECT * FROM Reminders 
      WHERE (type="${DAILY}" AND time<="${currentTime}" 
        AND (nextexecution<="${now.toISOString()}" OR nextexecution IS NULL)) 
      OR (type="${WEEKLY}" AND dayofweek=${currentDay} 
        AND time<="${currentTime}" 
        AND (nextexecution<="${now.toISOString()}" OR nextexecution IS NULL))`,
    { type: QueryTypes.SELECT }
  );

  for (const row of reminders) {
    try {
      const channel = await client.channels.fetch(row.channel);
      await channel.send(row.message);
    } catch (error) {
      console.error(error);
      console.log(
        `Failed to send message #${row.id} to channel ${row.channel}`
      );
    }
    const next_date = now.addDays(row.type === DAILY ? 1 : 7);
    next_date.setUTCHours(0, 0, 0, 0);
    await sequelize.query(
      `UPDATE Reminders 
       SET nextexecution="${next_date.toISOString()}"
       WHERE id=${row.id}`
    );
  }
}

module.exports = {
  manageReminders,
};
