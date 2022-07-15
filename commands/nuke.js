const {SlashCommandBuilder} = require("@discordjs/builders");
const {PermissionFlagsBits} = require("discord-api-types/v10");
const {sequelize} = require("../database");
const {client} = require("../client");
const {ChannelTypes, ButtonTypes} = require("../common/enums");
const {sendSurveyModal} = require("../common/functions");
const {MessageActionRow, MessageButton} = require("discord.js");

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    await interaction.deferReply({ephemeral: true})
    if (interaction.customId.split('@')[0] === ButtonTypes.NUKE_CHANNEL) {
        interaction.channel.clone()
            .then(async channel => {
                await channel.setPosition(interaction.channel.position)
                await channel.send(`☣⚠️ Big boom happened in the room ⚠️☣`);
                await channel.send(`https://c.tenor.com/6Ga4eX7MnUQAAAAC/putin-nuclear.gif`);
                sequelize.query(
                    `UPDATE Reminders
                     SET channel="${channel.id}"
                     WHERE channel = "${interaction.channel.id}" `
                );
                sequelize.query(
                    `UPDATE Channels
                     SET channel="${channel.id}"
                     WHERE channel = "${interaction.channel.id}" `
                )
            })
        interaction.channel.delete()
    } else if (interaction.customId.split('@')[0] === ButtonTypes.ABORT_NUKE_CHANNEL)
        interaction.editReply({
            content: 'Nuke canceled',
            ephemeral: true
        })
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nuke")
        .setDescription("Deletes and recreates the channel")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false),

    async execute(interaction) {
        const row = new MessageActionRow()
            .addComponents(new MessageButton()
                .setCustomId(
                    `${ButtonTypes.NUKE_CHANNEL}@${interaction.channel.id}`
                )
                .setLabel('YES')
                .setStyle('SUCCESS')
            )
            .addComponents(new MessageButton()
                .setCustomId(
                    `${ButtonTypes.ABORT_NUKE_CHANNEL}@${interaction.channel.id}`
                )
                .setLabel('NO')
                .setStyle('DANGER')
            )
        interaction.reply({
            content: 'Do you really want to nuke the channel?',
            components: [row],
            ephemeral: true
        })


    },
};
