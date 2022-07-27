const { PermissionFlagsBits, ButtonStyle } = require("discord-api-types/v10");
const { sequelize } = require("../database");
const { client } = require("../client");
const { ButtonTypes } = require("../common/enums");
const {
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
} = require("discord.js");

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId.split("@")[0] === ButtonTypes.NUKE_CHANNEL) {
    await interaction.deferReply({ ephemeral: true });
    const position = interaction.channel.position;
    const channelId = interaction.channel.id;
    interaction.channel.clone().then(async (channel) => {
      await channel.setPosition(position);
      await channel.send(`☣⚠️ Big boom happened in the room ⚠️☣`);
      await channel.send(
        `https://c.tenor.com/6Ga4eX7MnUQAAAAC/putin-nuclear.gif`
      );
      sequelize.query(
        `UPDATE Reminders
                 SET channel="${channel.id}"
                 WHERE channel = "${channelId.id}" `
      );
      sequelize.query(
        `UPDATE Channels
                 SET channel="${channel.id}"
                 WHERE channel = "${channelId.id}" `
      );
    });
    interaction.channel.delete();
  } else if (
    interaction.customId.split("@")[0] === ButtonTypes.ABORT_NUKE_CHANNEL
  )
    interaction.reply({
      content: "Nuke canceled",
      ephemeral: true,
    });
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nuke")
    .setDescription("Deletes and recreates the channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false),

  async execute(interaction) {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`${ButtonTypes.NUKE_CHANNEL}@${interaction.channel.id}`)
          .setLabel("YES")
          .setStyle(ButtonStyle.Success)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId(
            `${ButtonTypes.ABORT_NUKE_CHANNEL}@${interaction.channel.id}`
          )
          .setLabel("NO")
          .setStyle(ButtonStyle.Danger)
      );
    interaction.reply({
      content: "Do you really want to nuke the channel?",
      components: [row],
      ephemeral: true,
    });
  },
};
