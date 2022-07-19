const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "messageCreate",
  execute(message) {
    if (message.author.bot) return false;
    if (
      message.content.includes("@here") ||
      message.content.includes("@everyone") ||
      message.type === "REPLY"
    )
      return false;
    const embeds = new MessageEmbed()
      .setTitle("About the author")
      .setColor("#339966")
      .setDescription(
        "My master is just a simple retarded that does this for fun"
      )
      .addField(
        "Support my master :heart:",
        "If you want to support him donate to his PayPal:\n" +
          "https://www.paypal.com/donate/?hosted_button_id=XJYCTJ7RLCAEE"
      )
      .setFooter({
        text:
          "Any issues or suggestion for the bot?" +
          "Contact @BarbaH#2895 and tell him that he's incapable",
      });
    if (message.mentions.has(message.client.user.id)) {
      message.reply({
        content: `Hey ${message.author}! I'm a bot born from BarbaH's brain.`,
        embeds: [embeds],
      });
    }
  },
};
