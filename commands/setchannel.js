const {SlashCommandBuilder} = require("@discordjs/builders");
const {PermissionFlagsBits} = require("discord-api-types/v10");
const {Channels} = require("../database");

const WELCOME = 'welcome'
const APPLICATIONS = 'members-applications'

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-channel")
        .setDescription("Uses this channel for welcome messages")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
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
                .setName(APPLICATIONS)
                .setDescription('Set channel as the member applications result channel')
        )
    ,

    async execute(interaction) {
        interaction.deferReply()
        if (interaction.options.getSubcommand() === WELCOME) {
            const res = await Channels.findOne({
                where: {
                    guild: interaction.guild.id,
                    channelType: WELCOME,
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
                    channelType: WELCOME,
                    channel: interaction.channel.id,
                    message: interaction.options.getString("message"),
                })
            return interaction.editReply({
                content: "Welcome channel configured!",
                ephemeral: true
            });
        } else if (interaction.options.getSubcommand() === APPLICATIONS) {
            const res = await Channels.findOne({
                where: {
                    guild: interaction.guild.id,
                    channelType: APPLICATIONS,
                }
            })
            if (res)
                res.update({
                    channel: interaction.channel.id,
                })
            else
                await Channels.create({
                    guild: interaction.guild.id,
                    channelType: APPLICATIONS,
                    channel: interaction.channel.id,
                })
            return interaction.editReply({
                content: "Applications result channel configured!",
                ephemeral: true
            });
        }
    },
};