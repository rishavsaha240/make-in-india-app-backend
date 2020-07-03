const config = require("../config/config");
const Sequelize = require("sequelize");

// module.exports = new Sequelize(config.DATABASE, config.NAME, config.PASSWORD, {
//   dialect: "mysql",
//   host: config.HOST,
// });

module.exports = new Sequelize(
  `postgres://${config.NAME}:${config.PASSWORD}@${config.HOST}:5432/${config.DATABASE}`
);
