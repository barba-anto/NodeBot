const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
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

Reminders.sync()

module.exports = {
  sequelize,
  Reminders,
};
