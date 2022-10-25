const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("time")
    .setDescription("Gives the current time in the desired timezone")
    .addStringOption((option) =>
      option.setName("timezone").setDescription("Timezone code")
    ),

  async execute(interaction) {
    await interaction.deferReply({
      ephemeral: true
    });
    const tz = interaction.options.getString("timezone") || "CET";
    let reply = `Please enter a valid time zone. Examples include "UTC", "America/Los_Angeles", or "Asia/Tokyo".\n
    See https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for a full list`;
    try {
      const timeString = new Date().toLocaleString("zu-ZA", { timeZone: tz });
      reply = `The current ${tz} time is: **${timeString}**`
    } catch (e) {}

    return interaction.editReply(reply);
  },
};
