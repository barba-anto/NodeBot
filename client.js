const { Collection, Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

module.exports = {
  client,
};
