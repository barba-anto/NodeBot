const {SlashCommandBuilder} = require("@discordjs/builders");
const {PermissionFlagsBits} = require("discord-api-types/v10");
const {sequelize} = require("../database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nuke")
        .setDescription("Deletes and recreates the channel")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false),

    async execute(interaction) {
        interaction.channel.delete().then((oldChannel) => {
            interaction.guild.channels
                .create(oldChannel.name, {
                    parent: oldChannel.parent,
                    type: oldChannel.type,
                    nsfw: oldChannel.nsfw,
                    permissionOverwrites: oldChannel.permissionOverwrites.cache,
                })
                .then(async (newChannel) => {
                    newChannel.send(`☣⚠️ Big boom happened in the room ⚠️☣`);

                    await sequelize.query(
                        `UPDATE Reminders
                         SET channel="${newChannel.id}"
                         WHERE channel = "${oldChannel.id}" `
                    );
                    await sequelize.query(
                        `UPDATE Channels
                         SET channel="${newChannel.id}"
                         WHERE channel = "${oldChannel.id}" `
                    )
                });
        });
    },
};
