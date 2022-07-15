const {ChannelTypes} = require("../common/enums");
const {Channels, AutoremovedRoles} = require("../database");
const {MessageEmbed} = require("discord.js");
module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return
        if (interaction.customId.split('@')[0] === ChannelTypes.APPLICATIONS_REQUEST) {
            await interaction.deferReply({ephemeral: true})
            const inGameName = interaction.fields.getTextInputValue('inGameName');
            const fromServer = interaction.fields.getTextInputValue('fromServer');
            const profession = interaction.fields.getTextInputValue('profession');
            const notes = interaction.fields.getTextInputValue('notes');

            const applicationsChannel = await Channels.findOne({
                where: {
                    guild: interaction.guild.id,
                    channelType: ChannelTypes.APPLICATIONS_RESULT
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
                const removeRole = await AutoremovedRoles.findOne({
                    where: {
                        guild: interaction.guild.id
                    }
                })
                if (removeRole)
                    interaction.member.roles.remove(removeRole.role)
                channel.send({
                    embeds: [embed]
                })
                return await interaction.editReply({
                    content: 'Your submission was recieved successfully!',
                    ephemeral: true
                });
            }
            return await interaction.editReply({
                content: 'Whoops, something went wrong :( Please contact a mod',
                ephemeral: true
            })
        }
        await interaction.editReply({
            content: 'Unknown modal',
            ephemeral: true
        })
    },
};
