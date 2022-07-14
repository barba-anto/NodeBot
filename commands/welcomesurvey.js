const {SlashCommandBuilder} = require("@discordjs/builders");
const {
    Modal,
    TextInputComponent,
    MessageActionRow,
    MessageEmbed
} = require('discord.js');

const {client} = require('../client')
const {Channels} = require("../database");

client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return
    if (interaction.customId === 'member-application-survey') {
        const inGameName = interaction.fields.getTextInputValue('inGameName');
        const fromServer = interaction.fields.getTextInputValue('fromServer');
        const profession = interaction.fields.getTextInputValue('profession');
        const notes = interaction.fields.getTextInputValue('notes');

        const applicationsChannel = await Channels.findOne({
            where: {
                guild: interaction.guild.id,
                channelType: 'members-applications'
            }
        })
        if (applicationsChannel) {
            const channel = await interaction.guild.channels.fetch(applicationsChannel.channel)
            const embed = new MessageEmbed()
                .setTitle(`Application of ${interaction.user.username}`)
                .setThumbnail(interaction.user.avatarURL())
                .addField('Top War name', inGameName, true)
                .addField('From server', fromServer, true)
                .addField('Profession', profession, true)
                .addField('Extra notes', notes, true)
            channel.send({
                embeds: [embed]
            })
            return interaction.reply({
                content: 'Your submission was recieved successfully!',
                ephemeral: true
            });
        }
        return interaction.reply({
            content: 'Whoops, something went wrong :( Please contact a mod',
            ephemeral: true
        })
    }
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName("member-application")
        .setDescription("Start the application survey for the server"),

    async execute(interaction) {
        const modal = new Modal()
            .setCustomId('member-application-survey')
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
        await interaction.showModal(modal);
    },
};
