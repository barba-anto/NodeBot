const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("howgay")
    .setDescription("How much rainbow are you from 0 to 100?")
    .addUserOption((option) =>
      option.setName("user").setDescription("Your target")
    ),

  async execute(interaction) {
    await interaction.deferReply()
    // gets a random int between 1 - 100
    const rNum = Math.floor(Math.random() * 100);

    //if (user_id == 355789422890844172) rNum = rNum % 2 == 0 ? 6969 : 9090 // KULO

    let description = "";

    if (rNum < 25) description = `Nice try, you're hetero`;
    else if (rNum < 50) description = `Uhm... Just "curious"?`;
    else if (rNum < 75)
      description = `Are you sure are you're not hiding something to yourself?`;
    else if (rNum <= 100) description = "Is that you, Enzo?";
    else description = `This is gay. Like REALLY gay. Kulo's level of gay`;

    const embed = new MessageEmbed()
      .setTitle(
        `**${
          (interaction.options.getUser("user")
            ? await interaction.guild.members.fetch(interaction.options.getUser("user"))
            : interaction.member).displayName
        } is ${rNum}% gay**`
      )
      .setDescription(description)
      .setColor(`#ffffff`)
      .setThumbnail(
        `https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Gay_Pride_Flag.svg/1920px-Gay_Pride_Flag.svg.png`
      );

    return interaction.editReply({ embeds: [embed] });
  },
};
