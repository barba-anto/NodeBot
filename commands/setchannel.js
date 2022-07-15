const {SlashCommandBuilder} = require("@discordjs/builders");
const {PermissionFlagsBits} = require("discord-api-types/v10");
const {Channels, AutoremovedRoles} = require("../database");
const {ChannelTypes, ButtonTypes} = require("../common/enums")
const {
    MessageActionRow,
    MessageButton,
} = require("discord.js");
const {client} = require('../client')
const {sendSurveyModal} = require("../common/functions");


client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId.split('@')[0] === ButtonTypes.APPLICATIONS_REQUEST) {
        await sendSurveyModal(interaction)

    }
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-channel")
        .setDescription("Uses this channel for welcome messages")
        // .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        // .addSubcommand(command =>
        //     command
        //         .setName(WELCOME)
        //         .setDescription('Set channel as the welcome channel')
        //         .addStringOption(option =>
        //             option.setName('message')
        //                 .setDescription("Welcome message to be sent")
        //                 .setRequired(true)
        //         )
        // )
        .addSubcommand(command =>
            command
                .setName(ChannelTypes.APPLICATIONS_RESULT)
                .setDescription('Set channel as the member applications result channel')
        )
        .addSubcommand(command =>
            command
                .setName(ChannelTypes.APPLICATIONS_REQUEST)
                .setDescription('Set channel as the member applications request channel')
                .addRoleOption(option =>
                    option
                        .setName('remove-role')
                        .setDescription('Role to be removed after the user completes the survey')
                )
        )
    ,

    async execute(interaction) {
        await interaction.deferReply({ephemeral: true})
        switch (interaction.options.getSubcommand()) {
            case ChannelTypes.WELCOME: {
                if (interaction.options.getSubcommand() === ChannelTypes.WELCOME) {
                    const res = await Channels.findOne({
                        where: {
                            guild: interaction.guild.id,
                            channelType: ChannelTypes.WELCOME,
                        }
                    })
                    if (res)
                        res.update({
                            channel: interaction.channel.id,
                            message: interaction.options.getString("message"),
                        })
                    else
                        await Channels.create({
                            guild: interaction.guild.id,
                            channelType: ChannelTypes.WELCOME,
                            channel: interaction.channel.id,
                            message: interaction.options.getString("message"),
                        })

                    return interaction.editReply({
                        content: "Welcome channel configured!",
                        ephemeral: true
                    });
                }
                break;
            }

            case ChannelTypes.APPLICATIONS_RESULT: {
                const res = await Channels.findOne({
                    where: {
                        guild: interaction.guild.id,
                        channelType: ChannelTypes.APPLICATIONS_RESULT,
                    }
                })
                if (res)
                    res.update({
                        channel: interaction.channel.id,
                    })
                else
                    await Channels.create({
                        guild: interaction.guild.id,
                        channelType: ChannelTypes.APPLICATIONS_RESULT,
                        channel: interaction.channel.id,
                    })
                interaction.editReply({
                    content: "Applications result channel configured!",
                    ephemeral: true
                });
                break;
            }
            case ChannelTypes.APPLICATIONS_REQUEST: {
                const res = await Channels.findOne({
                    where: {
                        guild: interaction.guild.id,
                        channelType: ChannelTypes.APPLICATIONS_REQUEST,
                    }
                })
                if (res)
                    res.update({
                        channel: interaction.channel.id,
                    })
                else
                    await Channels.create({
                        guild: interaction.guild.id,
                        channelType: ChannelTypes.APPLICATIONS_REQUEST,
                        channel: interaction.channel.id,
                    })

                const role = interaction.options.getRole("remove-role");
                if (role.id) {
                    const existingRole = await AutoremovedRoles.findOne({
                        where: {
                            guild: interaction.guild.id
                        }
                    })
                    if (existingRole)
                        existingRole.update({
                            role: role.id,
                        })
                    else
                        await AutoremovedRoles.create({
                            guild: interaction.guild.id,
                            role: role.id,
                        })
                }


                interaction.editReply({
                    content: "Applications request channel configured!",
                    ephemeral: true
                });


                const row = new MessageActionRow()
                    .addComponents(new MessageButton()
                        .setCustomId(
                            `${ButtonTypes.APPLICATIONS_REQUEST}@${interaction.channel.id}`
                        )
                        .setLabel('START SURVEY')
                        .setStyle('PRIMARY')
                    )
                interaction.channel.send({
                    content: 'Press the button to start the application',
                    components: [row]
                })
                break;
            }
            default:
                interaction.editReply({
                    content: "Unknown command",
                    ephemeral: true
                })
        }
    }
    ,
};