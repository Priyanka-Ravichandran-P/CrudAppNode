const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
let instance = null;
const connection = mysql.createConnection({

    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
    insecureAuth: true

});

connection.connect((err) => {
    if (err) console.log(err.message);
    console.log("DB " + connection.state)
});

class DbService {
    // Should be one instance
    static getDbInstance() {
        return instance ? instance : new DbService();
    }


    async getAlldata() {
        try {
            const response = await new Promise((resolve, reject) => {

                const query = "SELECT * FROM names";

                connection.query((query), (err, results) => {
                    if (err)
                        reject(new Error(err.message));

                    resolve(results);
                });

            });
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    async insertNewName(name) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO names (name, date_added) VALUES (?,?);";

                connection.query(query, [name, dateAdded], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return {
                id: insertId,
                name: name,
                dateAdded: dateAdded
            };
        } catch (err) {
            console.log(err);
        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id, 10); // Base 10
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM names WHERE id =?";

                connection.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
           return response === 1 ? true : false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async updateRowById(id,name) {
        try {
            id = parseInt(id, 10); // Base 10
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE names SET name =? WHERE id = ?";

                connection.query(query, [name, id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
            return response === 1 ? true : false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async searchByName(name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM names WHERE name = ?;";

                connection.query(query, [name], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }


}

module.exports = DbService;