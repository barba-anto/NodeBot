const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  logging: process.env.NODE_ENV === "dev" ? console.log : false,
});

const Reminders = sequelize.define("reminders", {
  guild: DataTypes.STRING,
  channel: DataTypes.STRING,
  type: DataTypes.STRING,
  dayofweek: DataTypes.SMALLINT,
  time: DataTypes.STRING,
  message: DataTypes.STRING,
  nextexecution: { type: DataTypes.STRING, defaultValue: "" },
});

const Channels = sequelize.define("channels", {
  guild: DataTypes.STRING,
  channelType: DataTypes.STRING,
  channel: DataTypes.STRING,
  message: DataTypes.STRING,
});

const AutoremovedRoles = sequelize.define("autoremovedroles", {
  guild: DataTypes.STRING,
  role: DataTypes.STRING,
});

Promise.all([Reminders.sync(), Channels.sync(), AutoremovedRoles.sync()]);

module.exports = {
  sequelize,
  Reminders,
  Channels,
  AutoremovedRoles,
};
