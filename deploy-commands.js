const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

// ADD GUILD COMMANDS
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

// ADD GLOBAL COMMANDS
// rest.put(Routes.applicationCommands(clientId), { body: commands })
// 	.then(() => console.log('Successfully registered global commands.'))
// 	.catch(console.error);

// DELETE GUILD COMMANDS
// rest.get(Routes.applicationGuildCommands(clientId, guildId))
//     .then(data => {
//         const promises = [];
//         for (const command of data) {
//             const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
//             promises.push(rest.delete(deleteUrl));
//         }
//         return Promise.all(promises);
//     })
// 	.then(() => console.log("Successfully deleted commands."));

// DELETE GLOBAL COMMANDS
// rest.get(Routes.applicationCommands(clientId))
//     .then(data => {
//         const promises = [];
//         for (const command of data) {
//             const deleteUrl = `${Routes.applicationCommands(clientId)}/${command.id}`;
//             promises.push(rest.delete(deleteUrl));
//         }
//         return Promise.all(promises);
//     })
// 	.then(() => console.log("Successfully deleted global commands."));

// SHOW GLOBAL COMMANDS
// rest.get(Routes.applicationCommands(clientId))
//     .then(data => {
//         for (const command of data) {
//             console.log(command)
//         }
//     });

// SHOW GUILD COMMANDS
// rest.get(Routes.applicationGuildCommands(clientId, guildId))
//     .then(data => {
//         for (const command of data) {
//             console.log(command)
//         }
//     });