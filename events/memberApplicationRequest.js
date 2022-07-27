const { ChannelTypes } = require("../common/enums");
const { Channels, AutoremovedRoles } = require("../database");
const { EmbedBuilder } = require("discord.js");
const { InteractionType } = require("discord-api-types/v10");
module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!(interaction.type === InteractionType.ModalSubmit)) return;
    if (
      interaction.customId.split("@")[0] === ChannelTypes.APPLICATIONS_REQUEST
    ) {
      await interaction.deferReply({ ephemeral: true });
      const inGameName = interaction.fields.getTextInputValue("inGameName");
      const fromServer = interaction.fields.getTextInputValue("fromServer");
      const profession = interaction.fields.getTextInputValue("profession");
      const notes = interaction.fields.getTextInputValue("notes");

      const applicationsChannel = await Channels.findOne({
        where: {
          guild: interaction.guild.id,
          channelType: ChannelTypes.APPLICATIONS_RESULT,
        },
      });
      if (applicationsChannel) {
        const channel = await interaction.guild.channels.fetch(
          applicationsChannel.channel
        );
        const embed = new EmbedBuilder()
          .setTitle(`Application of ${interaction.user.tag}`)
          .setDescription(`${interaction.user}`)
          .setThumbnail(interaction.user.avatarURL())
          .addFields(
            {
              name: "Top War name",
              value: inGameName,
              inline: true,
            },
            { name: "From server", value: fromServer, inline: true },
            { name: "Profession", value: profession, inline: true },
            { name: "Extra notes", value: notes, inline: true }
          )
          .setTimestamp()
          .setColor("#0055aa");
        const removeRole = await AutoremovedRoles.findOne({
          where: {
            guild: interaction.guild.id,
          },
        });
        if (removeRole) interaction.member.roles.remove(removeRole.role);
        channel
          .send({
            embeds: [embed],
            fetchReply: true,
          })
          .then((message) => {
            message.react("👍").then(() => message.react("👎"));
          });
        return await interaction.editReply({
          content: "Your submission was recieved successfully!",
          ephemeral: true,
        });
      }
      return await interaction.editReply({
        content: "Whoops, something went wrong :( Please contact a mod",
        ephemeral: true,
      });
    }
  },
};
