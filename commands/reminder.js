const {SlashCommandBuilder} = require("@discordjs/builders");
const {PermissionFlagsBits} = require("discord-api-types/v10");
const {MessageEmbed} = require("discord.js");

const {Reminders} = require("../database");

const DAILY = "daily";
const WEEKLY = "weekly";

const DAYSOFWEEK = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday",
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reminder")
        .setDescription("Under developement...")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false)

        // Add a reminder
        .addSubcommandGroup((group) =>
            group
                .setName("add")
                .setDescription("Add daily reminder. Time MUST BE in HH:MM format")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("daily")
                        .setDescription("Add daily reminder. Time MUST BE in HH:MM format")
                        .addStringOption((option) =>
                            option
                                .setName("hhmm")
                                .setDescription("UTC time when the message must be sent")
                                .setRequired(true)
                        )
                        .addStringOption((option) =>
                            option
                                .setName("message")
                                .setDescription("Message to send at the specified time")
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("weekly")
                        .setDescription("Add weekly reminder. Time MUST BE in HH:MM format")
                        .addIntegerOption((option) =>
                            option
                                .setName("dayoftheweek")
                                .setDescription(
                                    "What action should be taken with the users points?"
                                )
                                .addChoices(
                                    {name: "Monday", value: 1},
                                    {name: "Tuesday", value: 2},
                                    {name: "Wednesday", value: 3},
                                    {name: "Thursday", value: 4},
                                    {name: "Friday", value: 5},
                                    {name: "Saturday", value: 6},
                                    {name: "Sunday", value: 7}
                                )
                                .setRequired(true)
                        )
                        .addStringOption((option) =>
                            option
                                .setName("hhmm")
                                .setDescription("UTC time when the message must be sent")
                                .setRequired(true)
                        )
                        .addStringOption((option) =>
                            option
                                .setName("message")
                                .setDescription("Message to send at the specified time")
                                .setRequired(true)
                        )
                )
        )

        // Show reminders
        .addSubcommandGroup((group) =>
            group
                .setName("show")
                .setDescription("Shows active reminders for the channel")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("weekly")
                        .setDescription("Shows active weekly reminders for the channel")
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("daily")
                        .setDescription("Shows active daily reminders for the channel")
                )
        )
        // Show reminders
        .addSubcommandGroup((group) =>
            group
                .setName("delete")
                .setDescription("Delete reminders for the channel")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("weekly")
                        .setDescription("Delete weekly reminders for the channel")
                        .addIntegerOption((option) =>
                            option
                                .setName("id")
                                .setDescription("ID of the reminder that should be deleted")
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("daily")
                        .setDescription("Delete daily reminders for the channel")
                        .addIntegerOption((option) =>
                            option
                                .setName("id")
                                .setDescription("ID of the reminder that should be deleted")
                                .setRequired(true)
                        )
                )
        ),

    async execute(interaction) {
        await interaction.deferReply()
        const validateTime = (time) => {
            const timeReg = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
            return time.match(timeReg);
        };

        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();

        let res = null;

        if (subcommandGroup === "add") {
            const time = interaction.options.getString("hhmm");

            if (!validateTime(time))
                interaction.editReply({
                    content: `Time format is not valid! It must be in HH:MM format.`,
                    ephemeral: true,
                });

            if (subcommand === DAILY)
                res = await Reminders.create({
                    guild: interaction.guild.id,
                    channel: interaction.channel.id,
                    type: subcommand,
                    time: time,
                    message: interaction.options.getString("message"),
                });
            else if (subcommand === WEEKLY)
                res = await Reminders.create({
                    guild: interaction.guild.id,
                    channel: interaction.channel.id,
                    type: subcommand,
                    dayofweek: interaction.options.getInteger("dayoftheweek"),
                    time: time,
                    message: interaction.options.getString("message"),
                });

            if (res)
                interaction.editReply({
                    content: `Reminder #${res.id} created successfully`,
                    ephemeral: true,
                });
        } else if (subcommandGroup === "show") {
            res = await Reminders.findAll({
                where: {
                    guild: interaction.guild.id,
                    channel: interaction.channel.id,
                    type: subcommand,
                },
            });
            const embeds = res.map((reminder) => {
                const fields = [];
                if (subcommand === WEEKLY)
                    fields.push({
                        name: "Day of the week",
                        value: DAYSOFWEEK[reminder.dayofweek],
                    });
                fields.push({name: "Time", value: reminder.time});
                fields.push({name: "Message", value: reminder.message});

                return new MessageEmbed()
                    .setColor("#ffffff")
                    .setTitle(`#${reminder.id}`)
                    .addFields(...fields);
            });

            if (embeds.length)
                interaction.editReply({
                    embeds: embeds,
                    ephemeral: true,
                });
            else interaction.editReply("No reminders for this channel");
        } else if (subcommandGroup === "delete") {
            const messageId = interaction.options.getInteger("id");
            res = await Reminders.destroy({
                where: {
                    guild: interaction.guild.id,
                    channel: interaction.channel.id,
                    type: subcommand,
                    id: messageId,
                },
            });
            if (res)
                interaction.editReply({
                    content: `Reminder #${messageId} deleted successfully`,
                    ephemeral: true,
                });
            else
                interaction.editReply({
                    content: `Reminder #${messageId} not found!`,
                    ephemeral: true,
                });
        }
    },
};
