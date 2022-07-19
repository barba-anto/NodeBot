const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Have a laugh and don't complain"),

  async execute(interaction) {
    await interaction.deferReply();
    const joke = await axios(
      "https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky,Christmas?blacklistFlags=religious,racist,sexist&format=txt"
    ).then((res) => (res.data ? res.data : "Oops... Something went wrong :("));

    return interaction.editReply(joke);
  },
};
