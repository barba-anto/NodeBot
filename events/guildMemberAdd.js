const { Channels } = require("../database");

module.exports = {
  name: "guildMemberAdd",
  async execute(interaction) {
    // console.log(
    //     `${interaction.displayName} joined server`
    // );
    // const welcomeChannel = await Channels.findOne({
    //     where: {
    //         guild: interaction.guild.id,
    //         channelType: 'welcome'
    //     }
    // })
    // if (welcomeChannel) {
    //     const channel = await interaction.guild.channels.fetch(welcomeChannel.channel)
    //     channel.send(`<@${interaction.user.id}> ` + welcomeChannel.message)
    // }
  },
};
