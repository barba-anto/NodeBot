const {
  ActionRowBuilder,
  SelectMenuBuilder,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const { PermissionFlagsBits } = require("discord-api-types/v10");
const { client } = require("../client");

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isSelectMenu()) return;

  if (interaction.customId.split("@")[0] === "role-auto-assignment") {
    await interaction.deferUpdate({ ephemeral: true });
    await interaction.member.roles.add(interaction.values);
    await interaction.followUp({
      content: "Roles updated!",
      ephemeral: true,
      components: [],
    });
  }
});

const MAX_OPTIONS = 20;

const command = new SlashCommandBuilder()
  .setName("role-auto-assignment")
  .setDescription("Let people choose his own roles")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
  .addStringOption((option) =>
    option
      .setName("text")
      .setDescription("Text to be shown over the selection box")
      .setRequired(true)
  );

for (let i = 1; i <= MAX_OPTIONS; i++)
  command.addRoleOption((option) =>
    option
      .setName(`role${i}`)
      .setDescription(`Role ${i}`)
      .setRequired(i === 1)
  );

module.exports = {
  data: command,
  async execute(interaction) {
    let options = [];

    for (let i = 1; i <= MAX_OPTIONS; i++) {
      const option = interaction.options.getRole(`role${i}`);
      if (option) {
        options.push({
          label: option.name,
          value: option.id,
        });
      }
    }

    const row = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId(`role-auto-assignment@`)
        .setPlaceholder("Nothing selected")
        .setMinValues(0)
        .setMaxValues(options.length)
        .addOptions(options)
    );

    const embed = new EmbedBuilder()
      .setTitle(interaction.options.getString("text"))
      .setDescription(
        "The roles will be assigned to you, to remove them you have to do it from your profile"
      );

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  },
};
