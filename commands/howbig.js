const { SlashCommandBuilder, bold } = require("@discordjs/builders");
const { MessageEmbed, CommandInteraction} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("howbig")
    .setDescription("Melons or peanuts? I know even without looking at you!")
    .addUserOption((option) =>
      option.setName("user").setDescription("Your target")
    ),

  async execute(interaction) {
    await interaction.deferReply()
    const extermities = [`（）`, `()`];
    const middle = [`ㅅ`, `)(`, `Y`];
    const nips = [`。`, `⊙`, `.`, `v`, `•`, `*`, `O`, `o`, `°`];

    const eRand = extermities[Math.floor(Math.random() * extermities.length)];
    const mRand = middle[Math.floor(Math.random() * middle.length)];
    const nRand = nips[Math.floor(Math.random() * nips.length)];

    const boobs = eRand[0] + nRand + mRand + nRand + eRand[1];

    const embed = new MessageEmbed()
      .setTitle(
        `**${
          (interaction.options.getUser("user")
            ? await interaction.guild.members.fetch(interaction.options.getUser("user"))
            : interaction.member).displayName
        }'s boobs are like this**`
      )
      .setDescription(bold(boobs))
      .setColor(`#ffffff`);

    return interaction.editReply({ embeds: [embed] });
  },
};
