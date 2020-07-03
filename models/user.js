const { Sequelize, DataTypes } = require("sequelize");

const db = require("./index");

const user = db.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      isAlphanumeric: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      isAlphanumeric: true,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  },
  {
    underscored: true,
  }
);

module.exports = user;
