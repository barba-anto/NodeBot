const { SlashCommandBuilder, bold } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("howlong")
    .setDescription(`"Oh pianooo, l'è grande Roccooo"`)
    .addUserOption((option) =>
      option.setName("user").setDescription("Your target")
    ),

  async execute(interaction) {
    // gets a random int between 1 - 20
    const rNum = Math.round(Math.random() * 20);

    const embed = new MessageEmbed()
      .setTitle(
        `**${
          interaction.options.getUser("user")
            ? interaction.options.getUser("user").username
            : interaction.user.username
        }'s peepee is**`
      )
      .setDescription(`**c${"=".repeat(rNum)}3**`)
      .setColor(`#00ffff`);

    return interaction.reply({ embeds: [embed] });
  },
};
