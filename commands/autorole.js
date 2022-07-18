const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageActionRow, MessageSelectMenu} = require("discord.js");
const {PermissionFlagsBits} = require("discord-api-types/v10");
const {client} = require("../client")

client.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu()) return;

    if (interaction.customId.split('@')[0] === 'autorole') {
        await interaction.deferUpdate({ephemeral: true});
        const allRoles = interaction.customId.split('@')[1].split(';')
        await interaction.member.roles.remove(allRoles)
        await interaction.member.roles.add(interaction.values)
        await interaction.followUp({
            content: 'Roles updated!',
            ephemeral: true,
            components: []
        });
    }
});

const MAX_OPTIONS = 20

const command = new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("Let people choose his own roles")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)

for (let i = 1; i <= MAX_OPTIONS; i++)
    command.addRoleOption(option => option
        .setName(`role${i}`)
        .setDescription(`Role ${i}`)
        .setRequired(i === 1)
    )

module.exports = {
    data: command,
    async execute(interaction) {
        let options = []
        let roles = []

        for (let i = 1; i <= MAX_OPTIONS; i++) {
            const option = interaction.options.getRole(`role${i}`)
            if (option) {
                options.push({
                    label: option.name,
                    value: option.id
                })
                roles.push(option.id)
            }
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId(`autorole@${roles.join(';')}`)
                    .setPlaceholder('Nothing selected')
                    .setMinValues(0)
                    .setMaxValues(options.length)
                    .addOptions(options),
            );

        await interaction.reply({
            content: 'Select your role',
            components: [row]
        });
    },
};
