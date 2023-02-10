const Sequelize = require("sequelize");

const sequelize = new Sequelize("posgres","postgres","admin",{
    dialect: "postgres"
});

const Test = sequelize.define("Test", {
    Name: {
        type: Sequelize.TEXT
    }
});

