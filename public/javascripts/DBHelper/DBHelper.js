const Sequelize = require("sequelize");

class DBHelper {
    #sequelize = new Sequelize(db_name, userName, password, {
        host: host,
        dialect: dialect,
        define: {
            timestamps: false
        }
    });
    constructor() {
        this.#testConnection();
    }
    async #testConnection() {
        try {
            await this.#sequelize.authenticate();
            alert('Connection has been established successfully.');
          } catch (error) {
            alert('Unable to connect to the database:', error);
          }
    }
    closeConnection() {
        this.#sequelize.close();
    }
    testGetReq() {
        const Test = this.#sequelize.define("Test", {
            Name: {
                type: Sequelize.TEXT
            }
        });
        this.#sequelize.sync().then(result=>{
            console.log(result);
          })
          .catch(err=> console.log(err));
        Test.findAll({raw:true}).then(Test=>{
            alert(Test);
        }).catch(err=>alert(err));
    }
}