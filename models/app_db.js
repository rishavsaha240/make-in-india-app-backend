const { Sequelize, DataTypes } = require("sequelize");

const db = require("./index");

const app_db = db.define(
  "app_db",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      isAlphanumeric: true,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      isAlphanumeric: true,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alt1_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alt1_origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alt1_playstore: {
      type: DataTypes.STRING,
    },
    alt1_appstore: {
      type: DataTypes.STRING,
    },
    alt2_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alt2_origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alt2_playstore: {
      type: DataTypes.STRING,
    },
    alt2_appstore: {
      type: DataTypes.STRING,
    },
    alt3_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alt3_origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alt3_playstore: {
      type: DataTypes.STRING,
    },
    alt3_appstore: {
      type: DataTypes.STRING,
    },
    alt4_name: {
      type: DataTypes.STRING,
    },
    alt4_origin: {
      type: DataTypes.STRING,
    },
    alt4_playstore: {
      type: DataTypes.STRING,
    },
    alt4_appstore: {
      type: DataTypes.STRING,
    },
    alt5_name: {
      type: DataTypes.STRING,
    },
    alt5_origin: {
      type: DataTypes.STRING,
    },
    alt5_playstore: {
      type: DataTypes.STRING,
    },
    alt5_appstore: {
      type: DataTypes.STRING,
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

module.exports = app_db;
