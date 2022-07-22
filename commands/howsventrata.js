const { SlashCommandBuilder, bold } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("howsventrata")
    .setDescription(`"It's like throwing a sausage in a corridor"`)
    .addUserOption((option) =>
      option.setName("user").setDescription("Your target")
    ),

  async execute(interaction) {
    await interaction.deferReply()
    // gets a random int between 1 - 10
    const rNum = Math.round(Math.random() * 20);

    const extermities = [`[]`, `()`, `{}`, `{}`];
    const middle = [
      `(` + "ㅤ".repeat(rNum) + `)`,
      `{` + "ㅤ".repeat(rNum) + `}`,
      `I`,
      `[` + "ㅤ".repeat(rNum) + `]`,
    ];

    const eRand = extermities[Math.floor(Math.random() * extermities.length)];
    const mRand = middle[Math.floor(Math.random() * middle.length)];

    const embed = new MessageEmbed()
      .setTitle(
        `**${
          (interaction.options.getUser("user")
            ? await interaction.guild.members.fetch(interaction.options.getUser("user"))
            : interaction.member).displayName
        }'s smile is like**`
      )
      .setDescription(bold(eRand[0] + mRand + eRand[1]))
      .setColor(`#ffffff`);

    return interaction.editReply({ embeds: [embed] });
  },
};
