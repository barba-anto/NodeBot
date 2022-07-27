const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("howlong")
    .setDescription(`"Oh pianooo, l'è grande Roccooo"`)
    .addUserOption((option) =>
      option.setName("user").setDescription("Your target")
    ),

  async execute(interaction) {
    await interaction.deferReply()
    // gets a random int between 1 - 20
    const rNum = Math.round(Math.random() * 20);

    const embed = new EmbedBuilder()
      .setTitle(
        `**${
          (interaction.options.getUser("user")
            ? await interaction.guild.members.fetch(interaction.options.getUser("user"))
            : interaction.member).displayName
        }'s peepee is**`
      )
      .setDescription(`**c${"=".repeat(rNum)}3**`)
      .setColor(`#00ffff`);

    return interaction.editReply({ embeds: [embed] });
  },
};
