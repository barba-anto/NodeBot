const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("insult")
    .setDescription(
      "Do you even need to ask? Tag someone and have fun, hopefully it will start a fight"
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The poor user you want to insult")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const insult = await axios(
      "https://insult.mattbas.org/api/insult.json"
    ).then((res) =>
      res.data
        ? res.data.insult
        : "is lucky... Something went wrong with request :("
    );

    return interaction.editReply(
      `${interaction.options.getUser("user")} ${insult}`
    );
  },
};
