const {manageReminders} = require('../scheduled/reminders')

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    manageReminders()
    setInterval(manageReminders, 30*1000)
  },
};