const {
    Modal,
    TextInputComponent,
    MessageActionRow
} = require("discord.js");
const {ChannelTypes} = require("./enums");

async function sendSurveyModal(interaction) {
    const modal = new Modal()
        .setCustomId(`${ChannelTypes.APPLICATIONS_REQUEST}@${interaction.user.id}`)
        .setTitle('Member application survey');
    // Add components to modal
    // Create the text input components
    const inGameName = new TextInputComponent()
        .setCustomId('inGameName')
        // The label is the prompt the user sees for this input
        .setLabel("What's your TopWar nickname?")
        // Short means only a single line of text
        .setStyle('SHORT');
    const fromServer = new TextInputComponent()
        .setCustomId('fromServer')
        .setLabel("What server are you in?")
        .setStyle('SHORT');
    const profession = new TextInputComponent()
        .setCustomId('profession')
        .setLabel("Mechanical Master (MM) or Combat Elite (CE)?")
        .setStyle('SHORT');
    const notes = new TextInputComponent()
        .setCustomId('notes')
        .setLabel("Any extra notes/reccomendations?")
        .setStyle('PARAGRAPH');
    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstRow = new MessageActionRow().addComponents(inGameName);
    const secondRow = new MessageActionRow().addComponents(fromServer);
    const thirdRow = new MessageActionRow().addComponents(profession);
    const fourthRow = new MessageActionRow().addComponents(notes);
    // Add inputs to the modal
    modal.addComponents(firstRow, secondRow, thirdRow, fourthRow);
    // Show the modal to the user
    return interaction.showModal(modal);
}

module.exports = {
    sendSurveyModal
}