const {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
} = require("discord.js");
const { ChannelTypes } = require("./enums");
const { TextInputStyle } = require("discord-api-types/v10");

async function sendSurveyModal(interaction) {
  const modal = new ModalBuilder()
    .setCustomId(`${ChannelTypes.APPLICATIONS_REQUEST}@${interaction.user.id}`)
    .setTitle("Member application survey");
  // Add components to modal
  // Create the text input components
  const inGameName = new TextInputBuilder()
    .setCustomId("inGameName")
    // The label is the prompt the user sees for this input
    .setLabel("What's your TopWar nickname?")
    // Short means only a single line of text
    .setStyle(TextInputStyle.Short);
  const fromServer = new TextInputBuilder()
    .setCustomId("fromServer")
    .setLabel("What server are you in?")
    .setStyle(TextInputStyle.Short);
  const profession = new TextInputBuilder()
    .setCustomId("profession")
    .setLabel("Mechanical Master (MM) or Combat Elite (CE)?")
    .setStyle(TextInputStyle.Short);
  const notes = new TextInputBuilder()
    .setCustomId("notes")
    .setLabel("Any extra notes/reccomendations?")
    .setStyle(TextInputStyle.Paragraph);
  // An action row only holds one text input,
  // so you need one action row per text input.
  const firstRow = new ActionRowBuilder().addComponents(inGameName);
  const secondRow = new ActionRowBuilder().addComponents(fromServer);
  const thirdRow = new ActionRowBuilder().addComponents(profession);
  const fourthRow = new ActionRowBuilder().addComponents(notes);
  // Add inputs to the modal
  modal.addComponents(firstRow, secondRow, thirdRow, fourthRow);
  // Show the modal to the user
  return interaction.showModal(modal);
}

module.exports = {
  sendSurveyModal,
};
